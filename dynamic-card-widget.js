(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            .card-container {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background-color: #f5f5f5;
                border-radius: 8px;
                overflow: hidden;
            }

            .card-header {
                display: flex;
                align-items: center;
                background-color: #1a73e8;
                color: white;
                padding: 15px;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .card-header-title {
                flex: 1;
                font-weight: bold;
                font-size: 18px;
            }

            .card-buttons {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 6px;
                z-index: 2;
            }

            .card-icon {
                position: absolute;
                top: 10px;
                left: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #1a73e8;
                color: white;
                font-size: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 2;
            }

            .dynamic-button {
                display: flex;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background-color 0.3s;
                font-size: 14px;
                width: 32px;
                height: 32px;
                align-items: center;
                justify-content: center;
                background-color: #008509;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .dynamic-button:hover {
                background-color: #006507;
                box-shadow: 0 3px 6px rgba(0,0,0,0.3);
            }

            .cards-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .card {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
                position: relative;
            }

            .card:hover {
                transform: translateY(-4px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .card.selected {
                border: 2px solid #1a73e8;
                box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
            }

            .card-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px;
                border-radius: 4px;
                background-color: #f8f9fa;
            }

            .card-row-symbol {
                display: inline-block;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                margin-right: 10px;
                font-size: 18px;
            }

            .card-row-label {
                font-weight: 600;
                margin-right: 8px;
                color: #555;
                min-width: 80px;
            }

            .card-row-value {
                flex: 1;
                color: #333;
                word-break: break-word;
            }

            .pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 15px;
                background-color: #ffffff;
                border-top: 1px solid #ddd;
                gap: 10px;
            }

            .pagination-button {
                padding: 8px 16px;
                border: 1px solid #1a73e8;
                background-color: white;
                color: #1a73e8;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .pagination-button:hover:not(:disabled) {
                background-color: #1a73e8;
                color: white;
            }

            .pagination-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .pagination-info {
                font-size: 14px;
                color: #666;
            }

            .no-data-message {
                padding: 40px;
                text-align: center;
                color: #666;
                font-style: italic;
                background-color: #ffffff;
                border-radius: 8px;
                margin: 20px;
            }

            /* Symbol styles */
            .symbol-check { color: #4CAF50; }
            .symbol-x { color: #F44336; }
            .symbol-arrow-up { color: #4CAF50; }
            .symbol-arrow-down { color: #F44336; }
            .symbol-minus { color: #FF9800; }
            .symbol-plus { color: #2196F3; }
            .symbol-bell { color: #FF9800; }
            .symbol-warning { color: #FF9800; }
            .symbol-info { color: #2196F3; }
            .symbol-flag { color: #F44336; }
            .symbol-lock { color: #9E9E9E; }
            .symbol-calendar { color: #2196F3; }
            .symbol-search { color: #2196F3; }
            .symbol-edit-pencil { color: #FF9800; }
            .symbol-change { color: #2196F3; }
        </style>

        <div class="card-container">
            
            <div class="card-header">
                <div class="card-header-title"></div>
            </div>
            
            <div class="cards-body">
                <div class="cards-grid" id="cardsGrid">
                    <!-- Cards will be dynamically generated here -->
                    <div class="no-data-message">No data available</div>
                </div>
            </div>

            <div class="pagination" id="pagination">
                <button class="pagination-button" id="prevButton">Previous</button>
                <span class="pagination-info" id="pageInfo">Page 1 of 1</span>
                <button class="pagination-button" id="nextButton">Next</button>
            </div>
        </div>
    `;

    class DynamicCardWidget extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            // Internal tracking
            this._props = {}; 
            this._cardData = [];
            this._cardRows = [];
            this._selectedCardIndex = null;
            this._selectedCardData = null;
            this._dynamicButtons = [];
            this._lastClickedButtonId = null;
            this._symbolMap = this._buildSymbolMap();
            this._initialized = false;
            
            // Pagination
            this._currentPage = 1;
            this._cardsPerPage = 12;
            this._totalPages = 1;

            // Get DOM elements
            this._cardsGrid = this._shadowRoot.getElementById('cardsGrid');
            this._actionButtons = this._shadowRoot.querySelector('.action-buttons');
            this._prevButton = this._shadowRoot.getElementById('prevButton');
            this._nextButton = this._shadowRoot.getElementById('nextButton');
            this._pageInfo = this._shadowRoot.getElementById('pageInfo');
            
            // Event listeners for pagination
            this._prevButton.addEventListener('click', this._previousPage.bind(this));
            this._nextButton.addEventListener('click', this._nextPage.bind(this));
        }

        _getSymbols() {
            return [
                { value: 'check', label: '✓ Check' },
                { value: 'x', label: '✕ X' },
                { value: 'arrow-up', label: '↑ Arrow Up' },
                { value: 'arrow-down', label: '↓ Arrow Down' },
                { value: 'minus', label: '- Minus' },
                { value: 'plus', label: '+ Plus' },
                { value: 'bell', label: '🔔 Bell' },
                { value: 'warning', label: '⚠ Warning' },
                { value: 'info', label: 'ℹ Info' },
                { value: 'flag', label: '⚑ Flag' },
                { value: 'lock', label: '🔒 Lock' },
                { value: 'calendar', label: '📅 Calendar' },
                { value: 'search', label: '🔍 Search' },
                { value: 'edit-pencil', label: '✏️ Edit' },
                { value: 'change', label: '🔄 Change' }
            ];
        }

        _buildSymbolMap() {
            const symbolMap = {};
            this._getSymbols().forEach(symbol => {
                const symbolChar = symbol.label.split(' ')[0];
                symbolMap[symbol.value] = symbolChar;
            });
            return symbolMap;
        }

        _renderDynamicButtons() {
            const existingButtons = this._shadowRoot.querySelectorAll('.dynamic-button');
            existingButtons.forEach(button => button.remove());
            
            try {
                const buttons = typeof this._dynamicButtons === 'string' ? 
                    JSON.parse(this._dynamicButtons) : this._dynamicButtons;
                
                if (Array.isArray(buttons) && buttons.length > 0) {
                    buttons.forEach(buttonConfig => {
                        if (buttonConfig.id && buttonConfig.visibility !== 'hidden') {
                            const button = document.createElement('button');
                            button.className = 'dynamic-button';
                            button.title = buttonConfig.tooltip || buttonConfig.id;
                            
                            button.textContent = this._symbolMap[buttonConfig.symbol] || '●';

                            if (buttonConfig.backgroundColor && buttonConfig.backgroundColor.trim() !== '') {
                                button.style.backgroundColor = buttonConfig.backgroundColor;
                            }

                            button.addEventListener('click', () => {
                                this._lastClickedButtonId = buttonConfig.id;
                                this.lastClickedButtonId = buttonConfig.id;
                                
                                this.dispatchEvent(new CustomEvent("onCustomButtonClicked", {
                                    detail: {
                                        buttonId: buttonConfig.id,
                                        buttonConfig: buttonConfig
                                    }
                                }));
                                
                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            lastClickedButtonId: buttonConfig.id
                                        }
                                    }
                                }));
                            });
                            
                            this._actionButtons.appendChild(button);
                        }
                    });
                }
            } catch (e) {
                console.error('Error rendering dynamic buttons:', e);
            }
        }

        _previousPage() {
            if (this._currentPage > 1) {
                this._currentPage--;
                this._renderCards();
            }
        }

        _nextPage() {
            if (this._currentPage < this._totalPages) {
                this._currentPage++;
                this._renderCards();
            }
        }

        _updatePagination() {
            this._totalPages = Math.ceil(this._cardData.length / this._cardsPerPage);
            this._pageInfo.textContent = `Page ${this._currentPage} of ${this._totalPages}`;
            
            this._prevButton.disabled = this._currentPage === 1;
            this._nextButton.disabled = this._currentPage === this._totalPages;
            
            if (this._totalPages <= 1) {
                this._shadowRoot.getElementById('pagination').style.display = 'none';
            } else {
                this._shadowRoot.getElementById('pagination').style.display = 'flex';
            }
        }

        _renderCards() {
            this._cardsGrid.innerHTML = '';

            if (!this._cardData || this._cardData.length === 0) {
                const noDataMsg = document.createElement('div');
                noDataMsg.className = 'no-data-message';
                noDataMsg.textContent = 'No data available';
                this._cardsGrid.appendChild(noDataMsg);
                this._updatePagination();
                return;
            }

            // Calculate pagination
            const startIndex = (this._currentPage - 1) * this._cardsPerPage;
            const endIndex = Math.min(startIndex + this._cardsPerPage, this._cardData.length);
            const pageData = this._cardData.slice(startIndex, endIndex);

            pageData.forEach((cardDataItem, pageIndex) => {
                const actualIndex = startIndex + pageIndex;
                const card = document.createElement('div');
                card.className = 'card';
                
                if (this._selectedCardIndex === actualIndex) {
                    card.classList.add('selected');
                }

                // Sort card rows by order
                const sortedRows = [...this._cardRows].sort((a, b) => 
                    (a.order || 0) - (b.order || 0)
                );

                sortedRows.forEach(rowConfig => {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'card-row';

                    // Add symbol if configured
                    if (rowConfig.symbol) {
                        const symbolSpan = document.createElement('span');
                        symbolSpan.className = `card-row-symbol symbol-${rowConfig.symbol}`;
                        symbolSpan.textContent = this._symbolMap[rowConfig.symbol] || '';
                        rowDiv.appendChild(symbolSpan);
                    }

                    // Add label
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'card-row-label';
                    labelSpan.textContent = rowConfig.label || '';
                    rowDiv.appendChild(labelSpan);

                    // Add value from data
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'card-row-value';
                    const dataKey = rowConfig.dataKey || '';
                    valueSpan.textContent = cardDataItem[dataKey] || '-';
                    rowDiv.appendChild(valueSpan);

                    card.appendChild(rowDiv);
                });

                // Click handler for card selection
                card.addEventListener('click', () => {
                    this._selectedCardIndex = actualIndex;
                    this._selectedCardData = cardDataItem;
                    this._renderCards();
                    
                    this.dispatchEvent(new Event("onCardSelected"));
                    this.dispatchEvent(new CustomEvent("propertiesChanged", {
                        detail: {
                            properties: {
                                selectedCardIndex: actualIndex,
                                selectedCardData: JSON.stringify(this._selectedCardData)
                            }
                        }
                    }));
                });

                this._cardsGrid.appendChild(card);
            });

            this._updatePagination();
        }

        _updateDataBinding(dataBinding) {
            if (
                dataBinding &&
                dataBinding.state === 'success' &&
                Array.isArray(dataBinding.data)
            ) {
                const cardData = dataBinding.data.map((row) => {
                    const transformedRow = {};
                    
                    // Process dimensions
                    const dims = dataBinding.metadata && dataBinding.metadata.dimensions;
                    if (dims && typeof dims === "object" && !Array.isArray(dims)) {
                        Object.keys(dims).forEach(dimKey => {
                            let cellObj = row[dimKey];
                            if (!cellObj) {
                                transformedRow[dimKey] = "";
                            } else if (cellObj.label) {
                                transformedRow[dimKey] = cellObj.label;
                            } else if (cellObj.formattedValue) {
                                transformedRow[dimKey] = cellObj.formattedValue;
                            } else if (cellObj.formatted) {
                                transformedRow[dimKey] = cellObj.formatted;
                            } else if (cellObj.raw !== undefined) {
                                transformedRow[dimKey] = cellObj.raw;
                            } else {
                                transformedRow[dimKey] = "";
                            }
                        });
                    }
                    
                    // Process measures
                    const measures = dataBinding.metadata && dataBinding.metadata.mainStructureMembers;
                    if (measures && typeof measures === "object" && !Array.isArray(measures)) {
                        Object.keys(measures).forEach(measKey => {
                            let cellObj = row[measKey];
                            if (!cellObj) {
                                transformedRow[measKey] = "";
                            } else if (cellObj.label) {
                                transformedRow[measKey] = cellObj.label;
                            } else if (cellObj.formattedValue) {
                                transformedRow[measKey] = cellObj.formattedValue;
                            } else if (cellObj.formatted) {
                                transformedRow[measKey] = cellObj.formatted;
                            } else if (cellObj.raw !== undefined) {
                                transformedRow[measKey] = cellObj.raw;
                            } else {
                                transformedRow[measKey] = "";
                            }
                        });
                    }
                    
                    return transformedRow;
                });
                
                this._cardData = cardData;
                this._currentPage = 1;
                this._renderCards();
            }
        }

        connectedCallback() {
            if (!this._initialized) {
                if (this.hasAttribute("cardData")) {
                    try {
                        this._cardData = JSON.parse(this.getAttribute("cardData"));
                    } catch (e) {
                        console.error("Invalid cardData attribute", e);
                    }
                }
                
                if (this.hasAttribute("cardRows")) {
                    try {
                        this._cardRows = JSON.parse(this.getAttribute("cardRows"));
                    } catch (e) {
                        console.error("Invalid cardRows attribute", e);
                    }
                }
                
                if (this.hasAttribute("dynamicButtons")) {
                    try {
                        this._dynamicButtons = JSON.parse(this.getAttribute("dynamicButtons"));
                    } catch (e) {
                        console.error("Invalid dynamicButtons attribute", e);
                    }
                }

                if (this.hasAttribute("cardsPerPage")) {
                    try {
                        this._cardsPerPage = parseInt(this.getAttribute("cardsPerPage"), 10);
                    } catch (e) {
                        console.error("Invalid cardsPerPage attribute", e);
                    }
                }

                if (this.cardDataBinding) {
                    this._updateDataBinding(this.cardDataBinding);
                }

                this._initialized = true;
            }

            this._renderDynamicButtons();
            this._renderCards();
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if ('dynamicButtons' in changedProperties) {
                try {
                    this._dynamicButtons = typeof changedProperties.dynamicButtons === 'string' ? 
                        JSON.parse(changedProperties.dynamicButtons) : changedProperties.dynamicButtons;
                    this._renderDynamicButtons();
                } catch (e) {
                    console.error('Invalid dynamic buttons:', e);
                }
            }

            if ('headerTitle' in changedProperties) {
                const headerTitleEl = this._shadowRoot.querySelector('.card-header-title');
                if (headerTitleEl) {
                    headerTitleEl.textContent = changedProperties.headerTitle || '';
                }
            }

            if ('cardRows' in changedProperties) {
                try {
                    this._cardRows = JSON.parse(changedProperties.cardRows);
                    this._renderCards();
                } catch (e) {
                    console.error('Invalid card rows:', e);
                }
            }

            if ("cardDataBinding" in changedProperties) {
                const dataBinding = changedProperties.cardDataBinding;
                if (dataBinding && dataBinding.state === 'success') {
                    this._updateDataBinding(dataBinding);
                }
            } else if (!this._cardData.length && this.cardDataBinding) {
                this._updateDataBinding(this.cardDataBinding);
            }

            if ('cardData' in changedProperties) {
                try {
                    this._cardData = JSON.parse(changedProperties.cardData);
                    this._currentPage = 1;
                    this._renderCards();
                } catch (e) {
                    console.error('Invalid card data:', e);
                }
            }

            if ('cardsPerPage' in changedProperties) {
                this._cardsPerPage = changedProperties.cardsPerPage;
                this._currentPage = 1;
                this._renderCards();
            }

            if ('headerColor' in changedProperties) {
                const headerEl = this._shadowRoot.querySelector('.card-header');
                if (headerEl) {
                    headerEl.style.backgroundColor = changedProperties.headerColor;
                }
            }

            if ('headerTextColor' in changedProperties) {
                const headerTitleEl = this._shadowRoot.querySelector('.card-header-title');
                if (headerTitleEl) {
                    headerTitleEl.style.color = changedProperties.headerTextColor;
                }
            }

            if ('cardBackgroundColor' in changedProperties) {
                const style = document.createElement('style');
                style.textContent = `
                    .card {
                        background-color: ${changedProperties.cardBackgroundColor} !important;
                    }
                `;
                this._shadowRoot.appendChild(style);
            }

            if ('cardHoverColor' in changedProperties) {
                const style = document.createElement('style');
                style.textContent = `
                    .card:hover {
                        background-color: ${changedProperties.cardHoverColor} !important;
                    }
                `;
                this._shadowRoot.appendChild(style);
            }

            if ('selectedCardColor' in changedProperties) {
                const style = document.createElement('style');
                style.textContent = `
                    .card.selected {
                        border-color: ${changedProperties.selectedCardColor} !important;
                    }
                `;
                this._shadowRoot.appendChild(style);
            }
        }

        // Getters and Setters
        get cardData() {
            return JSON.stringify(this._cardData);
        }

        set cardData(value) {
            try {
                this._cardData = JSON.parse(value);
                this._currentPage = 1;
                this._renderCards();
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: { properties: { cardData: value } }
                }));
            } catch (e) {
                console.error('Invalid card data:', e);
            }
        }

        get cardRows() {
            return JSON.stringify(this._cardRows);
        }

        set cardRows(value) {
            try {
                this._cardRows = JSON.parse(value);
                this._renderCards();
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: { properties: { cardRows: value } }
                }));
            } catch (e) {
                console.error('Invalid card rows:', e);
            }
        }

        get selectedCardIndex() {
            return this._selectedCardIndex !== null ? this._selectedCardIndex : -1;
        }

        set selectedCardIndex(value) {
            this._selectedCardIndex = value;
            if (value !== null && value >= 0 && value < this._cardData.length) {
                this._selectedCardData = this._cardData[value];
            }
            this._renderCards();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties: { selectedCardIndex: value } }
            }));
        }

        get selectedCardData() {
            return JSON.stringify(this._selectedCardData || {});
        }

        get cardsPerPage() {
            return this._cardsPerPage;
        }

        set cardsPerPage(value) {
            this._cardsPerPage = value;
            this._currentPage = 1;
            this._renderCards();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties: { cardsPerPage: value } }
            }));
        }

        get dynamicButtons() {
            return typeof this._dynamicButtons === 'string' ? 
                this._dynamicButtons : JSON.stringify(this._dynamicButtons);
        }

        set dynamicButtons(value) {
            try {
                this._dynamicButtons = typeof value === 'string' ? JSON.parse(value) : value;
                this._renderDynamicButtons();
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: { properties: { dynamicButtons: typeof value === 'string' ? value : JSON.stringify(value) } }
                }));
            } catch (e) {
                console.error('Invalid dynamic buttons:', e);
            }
        }

        get lastClickedButtonId() {
            return this._lastClickedButtonId || '';
        }

        set lastClickedButtonId(value) {
            this._lastClickedButtonId = value;
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { 
                    properties: { 
                        lastClickedButtonId: value 
                    } 
                }
            }));
        }

        getButtonVisibility(buttonId) {
            if (!this._dynamicButtons || !Array.isArray(this._dynamicButtons)) {
                return "";
            }
            const button = this._dynamicButtons.find(btn => btn.id === buttonId);
            return button ? button.visibility : "";
        }

        setButtonVisibility(buttonId, visibility) {
            if (visibility !== 'visible' && visibility !== 'hidden') {
                console.error("Invalid visibility value. Must be 'visible' or 'hidden'.");
                return;
            }

            let buttons = [];
            try {
                buttons = JSON.parse(this.dynamicButtons);
            } catch (e) {
                console.error("Error parsing dynamic buttons:", e);
                return;
            }

            let buttonFound = false;
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].id === buttonId) {
                    buttons[i].visibility = visibility;
                    buttonFound = true;
                    break;
                }
            }

            if (!buttonFound) {
                console.warn(`Button with ID '${buttonId}' not found.`);
                return;
            }

            this.dynamicButtons = JSON.stringify(buttons);

            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        dynamicButtons: JSON.stringify(buttons)
                    }
                }
            }));
        }

        getSelectedCardValue(key) {
            if (!this._selectedCardData || !key) {
                return "";
            }
            return String(this._selectedCardData[key] || "");
        }

        getCurrentPage() {
            return this._currentPage;
        }

        getTotalPages() {
            return this._totalPages;
        }

        goToPage(pageNumber) {
            const page = parseInt(pageNumber, 10);
            if (page >= 1 && page <= this._totalPages) {
                this._currentPage = page;
                this._renderCards();
                return "success";
            }
            return "error";
        }
    }

    customElements.define('dynamic-card-widget', DynamicCardWidget);
})();
