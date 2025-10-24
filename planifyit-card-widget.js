(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
            :host {
                /* CSS variables for styling from properties */
                --card-bg-color: #ffffff;
                --card-border-color: #e0e0e0;
                --selected-card-bg-color: #e8f0fe;
                --selected-card-border-color: #1a73e8;
                --card-title-color: #333333;
                --card-text-color: #555555;
            }

            .widget-container {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                margin-top: 10px;
                overflow: hidden;
            }

            .app-title {
                font-size: 18px; 
                font-weight: bold;
                text-align: left;
                margin-bottom: 5px; 
                color: #333; 
                text-transform: uppercase; 
                letter-spacing: 1.5px;
                padding: 10px 10px 0 10px;
            }

            .follow-link {
                font-size: 10px;
                transition: color 0.3s;
                text-decoration: none;
                position: relative;
                margin-top: 10px;
                display: block;
                padding: 0 10px 10px 10px;
            }

            .follow-link:hover { color: #007BFF; }

            .widget-header {
                display: flex;
                align-items: center;
                background-color: #1a73e8; /* Default header color */
                color: white;
                padding: 10px;
                position: sticky;
                top: 0;
                z-index: 10;
            }
            
            .widget-header-title {
                flex: 1;
                font-weight: bold;
            }

            .action-buttons {
                display: flex;
                gap: 8px;
            }

            .control-button {
                display: flex; 
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background-color 0.3s;
                font-size: 14px;
                width: 36px;
                height: 36px;
                background-color: transparent;
                align-items: center;
                justify-content: center;
            }

            .control-button:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }

           .cancel-button {
                display: none;
                background-color: #FF5370;
            }

            /* Card Layout Styles */
            .card-container {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                align-content: flex-start;
            }

            .no-data-message {
                padding: 20px;
                text-align: center;
                color: #666;
                font-style: italic;
                width: 100%;
            }

            .card {
                flex: 1 1 250px; /* Responsive sizing */
                min-width: 220px;
                background-color: var(--card-bg-color);
                border: 1px solid var(--card-border-color);
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                cursor: pointer;
                transition: box-shadow 0.3s, border-color 0.3s, background-color 0.3s;
                word-wrap: break-word;
                position: relative; /* For button positioning */
                padding-right: 40px; /* Make space for buttons */
            }

            .card:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }

            .card.selected {
                background-color: var(--selected-card-bg-color);
                border-color: var(--selected-card-border-color);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }

            .card-row {
                margin-bottom: 6px;
            }
            .card-row-title {
                font-weight: bold;
                font-size: 1.1em;
                color: var(--card-title-color);
                margin-bottom: 8px;
                padding-right: 30px; /* Don't overlap buttons */
            }
            .card-row-text {
                font-size: 0.9em;
                color: var(--card-text-color);
            }
            .card-row-label {
                font-weight: 600;
                color: var(--card-text-color);
                margin-right: 5px;
            }
            .card-row-symbol {
                font-size: 0.9em;
            }


            /* Pagination Styles */
            .pagination-controls {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                border-top: 1px solid #eee;
            }
            .pagination-button {
                border: none;
                background-color: #f0f0f0;
                color: #333;
                padding: 6px 12px;
                margin: 0 5px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .pagination-button:hover {
                background-color: #ddd;
            }
            .pagination-button:disabled {
                background-color: #f9f9f9;
                color: #aaa;
                cursor: not-allowed;
            }
            .pagination-info {
                font-size: 14px;
                color: #555;
            }

            /* Symbol styles */
            .symbol { display: inline-block; width: 16px; height: 16px; text-align: center; line-height: 16px; margin-right: 5px; }
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
            .symbol-lock { color: #333; }
            .symbol-calendar { color: #2196F3; }
            .symbol-search { color: #999; }
            .symbol-edit-pencil { color: #FF9800; }
            .symbol-change { color: #4CAF50; }
            .symbol-star { color: #FFC107; }

            /* Dynamic button styles (for in-card use) */
            .card-buttons-container {
                position: absolute;
                top: 8px;
                right: 8px;
                display: flex;
                flex-direction: row; /* Horizontal buttons */
                gap: 4px;
                z-index: 5;
            }
            
            .dynamic-button {
                display: flex;
                border: none;
                border-radius: 4px;
                color: #555; /* Default icon color */
                cursor: pointer;
                transition: background-color 0.3s, color 0.3s;
                font-size: 18px; /* Icon size */
                width: 28px;
                height: 28px;
                align-items: center;
                justify-content: center;
                background-color: transparent; /* Transparent by default */
                margin-right: 0;
                padding: 0;
            }
            
            .dynamic-button:hover {
                background-color: #f0f0f0; /* Light hover */
                color: #111;
            }
        </style>

        <div class="widget-container">
            <div class="app-title">PlanifyIT Card</div>
            
            <div class="widget-header">
                <div class="widget-header-title"></div>
                <div class="action-buttons">
                    <button id="multiSelectButton" class="control-button" title="Select Multiple">⬜✅</button>
                    <button id="cancelButton" class="control-button cancel-button" title="Cancel">✕</button>
                </div>
            </div>
            
            <div class="card-container" id="cardContainer">
                <div class="no-data-message">No data available</div>
            </div>

            <div class="pagination-controls" id="paginationControls">
                </div>
            
            <a href="https://www.linkedin.com/company/planifyit" target="_blank" class="follow-link">
                Folge uns auf LinkedIn - Planifyit
            </a>
        </div>
    `;

    class PlanifyITCardWidget extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
     
            this._props = {}; 
            this._cardData = [];
            this._dataStructure = [];
            this._cardLayout = [];
            this._selectedIndices = [];
            this._selectedData = [];
            this._isMultiSelectMode = false;
            this._dynamicButtons = []; 
            this._initialized = false;
            this._lastClickedButtonId = null;
            this._symbolMap = this._buildSymbolMap();
            this._cardsPerPage = 10;
            this._currentPage = 1;

            this._multiSelectButton = this._shadowRoot.getElementById('multiSelectButton');
            this._cancelButton = this._shadowRoot.getElementById('cancelButton');
            this._cardContainer = this._shadowRoot.getElementById('cardContainer');
            this._paginationControls = this._shadowRoot.getElementById('paginationControls');
            this._actionButtons = this._shadowRoot.querySelector('.action-buttons');
            
            this._multiSelectButton.addEventListener('click', this._toggleMultiSelectMode.bind(this));
            this._cancelButton.addEventListener('click', this._cancelMultiSelect.bind(this));
        }

        // --- Symbol Logic ---
        
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
                { value: 'change', label: '🔄 Change' },
                { value: 'star', label: '⭐ Star' }
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

        _createSymbolElement(symbolInfo) {
            const span = document.createElement('span');
            span.className = `symbol symbol-${symbolInfo.type}`;
            span.textContent = symbolInfo.symbol;
            return span;
        }

        // --- Selection Logic ---

        _toggleMultiSelectMode() {
            this._isMultiSelectMode = true;
            this._multiSelectButton.style.display = 'none';
            this._cancelButton.style.display = 'flex';
            this._selectedIndices = [];
            this._updateSelectedData();
            this._renderCards();
            
            this.dispatchEvent(new Event("onSelectionModeChange"));
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        isMultiSelectMode: true,
                        selectedIndices: "[]",
                        selectedData: "[]"
                    }
                }
            }));
        }
        
        _cancelMultiSelect() {
            this._isMultiSelectMode = false;
            this._multiSelectButton.style.display = 'flex';
            this._cancelButton.style.display = 'none';
            this._selectedIndices = [];
            this._updateSelectedData();
            this._renderCards();
            
            this.dispatchEvent(new Event("onSelectionModeChange"));
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        isMultiSelectMode: false,
                        selectedIndices: "[]",
                        selectedData: "[]"
                    }
                }
            }));
        }

        _handleCardClick(originalIndex, dataObject) {
            if (this._isMultiSelectMode) {
                const selectedIndexPos = this._selectedIndices.indexOf(originalIndex);
                if (selectedIndexPos > -1) {
                    this._selectedIndices.splice(selectedIndexPos, 1);
                } else {
                    this._selectedIndices.push(originalIndex);
                }
            } else {
                if (this._selectedIndices.includes(originalIndex)) {
                    this._selectedIndices = [];
                } else {
                    this._selectedIndices = [originalIndex];
                }
            }
            
            this._updateSelectedData();
            this._renderCards();
            
            this.dispatchEvent(new Event("onSelectionChanged"));
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        selectedIndices: JSON.stringify(this._selectedIndices),
                        selectedIndicesArray: this._selectedIndices,     
                        selectedData: JSON.stringify(this._selectedData)
                    }
                }
            }));
        }

        _updateSelectedData() {
            this._selectedData = this._selectedIndices.map(index => this._cardData[index]);
        }

        // --- Main Rendering Logic ---

        _renderWidget() {
            if (!this._initialized) return;
            this._renderCards();
            this._renderPagination();
        }

        _renderCards() {
            this._cardContainer.innerHTML = '';
            
            if (!this._cardData || this._cardData.length === 0) {
                this._cardContainer.innerHTML = '<div class="no-data-message">No data available</div>';
                return;
            }

            const sortedLayout = [...this._cardLayout].sort((a, b) => (a.order || 0) - (b.order || 0));
            
            const buttonsConfig = typeof this._dynamicButtons === 'string' ? 
                JSON.parse(this._dynamicButtons) : (this._dynamicButtons || []);

            const startIndex = (this._currentPage - 1) * this._cardsPerPage;
            const endIndex = this._currentPage * this._cardsPerPage;
            const paginatedData = this._cardData.slice(startIndex, endIndex);

            if (paginatedData.length === 0 && this._cardData.length > 0) {
                 this._cardContainer.innerHTML = '<div class="no-data-message">No data on this page</div>';
                 return;
            }

            paginatedData.forEach((dataObject, i) => {
                const originalIndex = startIndex + i;
                const card = document.createElement('div');
                card.className = 'card';
                if (this._selectedIndices.includes(originalIndex)) {
                    card.classList.add('selected');
                }
                card.addEventListener('click', () => this._handleCardClick(originalIndex, dataObject));

                // --- Add Dynamic Buttons to Card ---
                const cardButtonsContainer = document.createElement('div');
                cardButtonsContainer.className = 'card-buttons-container';
                
                if (Array.isArray(buttonsConfig) && buttonsConfig.length > 0) {
                    buttonsConfig.forEach(buttonConfig => {
                        if (buttonConfig.id && buttonConfig.visibility !== 'hidden') {
                            const button = document.createElement('button');
                            button.className = 'dynamic-button';
                            button.title = buttonConfig.tooltip || buttonConfig.id;
                            button.textContent = this._symbolMap[buttonConfig.symbol] || '●';
                            
                            if (buttonConfig.backgroundColor && buttonConfig.backgroundColor.trim() !== '') {
                                button.style.backgroundColor = buttonConfig.backgroundColor;
                                button.style.color = '#ffffff'; 
                            }
        
                            button.addEventListener('click', (e) => {
                                e.stopPropagation(); // Stop card click event
                                this._lastClickedButtonId = buttonConfig.id;
                                this.lastClickedButtonId = buttonConfig.id;
                                
                                this.dispatchEvent(new CustomEvent("onCustomButtonClicked", {
                                    detail: {
                                        buttonId: buttonConfig.id,
                                        buttonConfig: buttonConfig,
                                        originalIndex: originalIndex,
                                        dataObject: dataObject
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
                            cardButtonsContainer.appendChild(button);
                        }
                    });
                }
                card.appendChild(cardButtonsContainer);
                // --- End of Button Logic ---

                // Build card content based on layout
                sortedLayout.forEach(rowConfig => {
                    const value = dataObject[rowConfig.dataKey] || '';
                    const rowEl = document.createElement('div');
                    rowEl.className = 'card-row';

                    switch (rowConfig.type) {
                        case 'Title':
                            rowEl.classList.add('card-row-title');
                            rowEl.textContent = value;
                            card.appendChild(rowEl);
                            break;
                        
                        case 'Text':
                            rowEl.classList.add('card-row-text');
                            rowEl.innerHTML = `<span class="card-row-label">${rowConfig.label || rowConfig.dataKey}:</span>`;
                            rowEl.appendChild(document.createTextNode(value));
                            card.appendChild(rowEl);
                            break;

                        case 'Symbol':
                            if (String(value).toLowerCase() === String(rowConfig.valueToMatch).toLowerCase()) {
                                const symbolChar = this._symbolMap[rowConfig.symbol] || '●';
                                const symbolElement = this._createSymbolElement({ 
                                    type: rowConfig.symbol, 
                                    symbol: symbolChar 
                                });
                                
                                rowEl.classList.add('card-row-symbol');
                                rowEl.innerHTML = `<span class="card-row-label">${rowConfig.label || rowConfig.dataKey}:</span>`;
                                rowEl.appendChild(symbolElement);
                                card.appendChild(rowEl);
                            }
                            break;
                    }
                });
                this._cardContainer.appendChild(card);
            });
        }

        _renderPagination() {
            this._paginationControls.innerHTML = '';
            const totalPages = Math.ceil(this._cardData.length / this._cardsPerPage);
            if (totalPages <= 1) return;

            const prevButton = document.createElement('button');
            prevButton.className = 'pagination-button';
            prevButton.textContent = '◀ Prev';
            if (this._currentPage === 1) prevButton.disabled = true;
            prevButton.addEventListener('click', () => this._changePage(this._currentPage - 1));
            this._paginationControls.appendChild(prevButton);

            const pageInfo = document.createElement('span');
            pageInfo.className = 'pagination-info';
            pageInfo.textContent = `Page ${this._currentPage} of ${totalPages}`;
            this._paginationControls.appendChild(pageInfo);

            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-button';
            nextButton.textContent = 'Next ▶';
            if (this._currentPage === totalPages) nextButton.disabled = true;
            nextButton.addEventListener('click', () => this._changePage(this._currentPage + 1));
            this._paginationControls.appendChild(nextButton);
        }

        _changePage(newPage) {
            if (newPage < 1 || newPage > Math.ceil(this._cardData.length / this._cardsPerPage)) {
                return;
            }
            this._currentPage = newPage;
            this._renderWidget();
        }
        
        // --- SAC Lifecycle Hooks & Data Binding ---
        
        connectedCallback() {
            if (!this._initialized) {
                this._initialized = true;

                if (this.hasAttribute("isMultiSelectMode")) {
                    this._isMultiSelectMode = this.getAttribute("isMultiSelectMode") === "true";
                }
                this._multiSelectButton.style.display = this._isMultiSelectMode ? 'none' : 'flex';
                this._cancelButton.style.display = this._isMultiSelectMode ? 'flex' : 'none';

                if (this.hasAttribute("dynamicButtons")) {
                    try { this._dynamicButtons = JSON.parse(this.getAttribute("dynamicButtons")); } catch (e) {}
                }
                if (this.hasAttribute("cardLayout")) {
                    try { this._cardLayout = JSON.parse(this.getAttribute("cardLayout")); } catch (e) {}
                }
                if (this.hasAttribute("cardsPerPage")) {
                    this._cardsPerPage = parseInt(this.getAttribute("cardsPerPage"), 10) || 10;
                }
                if (this.hasAttribute("selectedIndices")) {
                    try { this._selectedIndices = JSON.parse(this.getAttribute("selectedIndices")); } catch (e) {}
                }
                
                if (this.cardDataBinding) {
                    this._updateDataBinding(this.cardDataBinding);
                }
            }
            this._renderWidget();
        }
        
        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }
        
        _updateDataBinding(dataBinding) {
            if (
                dataBinding &&
                dataBinding.state === 'success' &&
                Array.isArray(dataBinding.data)
            ) {
                const columns = [];
                const dims = dataBinding.metadata && dataBinding.metadata.dimensions;
                if (dims && typeof dims === "object" && !Array.isArray(dims)) {
                    Object.keys(dims).forEach(dimKey => {
                        const dimMeta = dims[dimKey];
                        columns.push({
                            name: dimKey,
                            label: dimMeta.description || dimMeta.label || dimMeta.id
                        });
                    });
                }
                 const measures = dataBinding.metadata && dataBinding.metadata.mainStructureMembers;
                if (measures && typeof measures === "object" && !Array.isArray(measures)) {
                    Object.keys(measures).forEach(measKey => {
                        const measMeta = measures[measKey];
                        columns.push({
                            name: measKey,
                            label: measMeta.label || measMeta.id
                        });
                    });
                }

                const cardData = dataBinding.data.map((row) => {
                    const transformedRow = {};
                    columns.forEach(col => {
                        let cellObj = row[col.name];
                        if (!cellObj) {
                            transformedRow[col.name] = "";
                        } else if (cellObj.label) {
                            transformedRow[col.name] = cellObj.label;
                        } else if (cellObj.formattedValue) {
                            transformedRow[col.name] = cellObj.formattedValue;
                        } else if (cellObj.formatted) {
                            transformedRow[col.name] = cellObj.formatted;
                        } else if (cellObj.raw !== undefined) {
                            transformedRow[col.name] = cellObj.raw;
                        } else {
                            transformedRow[col.name] = "";
                        }
                    });
                    return transformedRow;
                });
                
                this._dataStructure = columns;
                this._cardData = cardData;
                this._currentPage = 1;
                this._renderWidget();
            }
        }
        
        onCustomWidgetAfterUpdate(changedProperties) {
            if ("cardDataBinding" in changedProperties) {
                this._updateDataBinding(changedProperties.cardDataBinding);
            }
            
            if ('cardData' in changedProperties) {
                try {
                    this._cardData = JSON.parse(changedProperties.cardData);
                    this._currentPage = 1;
                    this._renderWidget();
                } catch (e) {}
            }

            if ('cardLayout' in changedProperties) {
                try {
                    this._cardLayout = JSON.parse(changedProperties.cardLayout);
                    this._renderWidget();
                } catch (e) {}
            }

            if ('cardsPerPage' in changedProperties) {
                this._cardsPerPage = parseInt(changedProperties.cardsPerPage, 10) || 10;
                this._currentPage = 1;
                this._renderWidget();
            }
            
            if ('dynamicButtons' in changedProperties) {
                try {
                    this._dynamicButtons = typeof changedProperties.dynamicButtons === 'string' ? 
                        JSON.parse(changedProperties.dynamicButtons) : changedProperties.dynamicButtons;
                    this._renderWidget();
                } catch (e) {}
            }
            
            if ('appTitle' in changedProperties) {
                const appTitleEl = this._shadowRoot.querySelector('.app-title');
                if (appTitleEl) {
                    appTitleEl.textContent = changedProperties.appTitle || '';
                }
            }

            if ('selectedIndices' in changedProperties) {
                try {
                    this._selectedIndices = JSON.parse(changedProperties.selectedIndices);
                    this._updateSelectedData();
                    this._renderWidget();
                } catch (e) {}
            }
            
            if ('isMultiSelectMode' in changedProperties) {
                this.isMultiSelectMode = changedProperties.isMultiSelectMode;
            }

            const hostStyle = this._shadowRoot.host.style;
            if ('cardBackgroundColor' in changedProperties) {
                hostStyle.setProperty('--card-bg-color', changedProperties.cardBackgroundColor);
            }
            if ('cardBorderColor' in changedProperties) {
                hostStyle.setProperty('--card-border-color', changedProperties.cardBorderColor);
            }
            if ('selectedCardColor' in changedProperties) {
                hostStyle.setProperty('--selected-card-bg-color', changedProperties.selectedCardColor);
            }
            if ('cardTitleColor' in changedProperties) {
                hostStyle.setProperty('--card-title-color', changedProperties.cardTitleColor);
            }
            if ('cardTextColor' in changedProperties) {
                hostStyle.setProperty('--card-text-color', changedProperties.cardTextColor);
            }
        }

        // --- Public Getters/Setters ---

        get dynamicButtons() {
            return typeof this._dynamicButtons === 'string' ? 
                this._dynamicButtons : JSON.stringify(this._dynamicButtons);
        }
        set dynamicButtons(value) {
            try {
                this._dynamicButtons = typeof value === 'string' ? JSON.parse(value) : value;
                this._renderWidget();
            } catch (e) {}
        }

        get lastClickedButtonId() {
            return this._lastClickedButtonId || '';
        }
        set lastClickedButtonId(value) {
            this._lastClickedButtonId = value;
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties: { lastClickedButtonId: value } }
            }));
        }

        getButtonVisibility(buttonId) {
          const button = (this._dynamicButtons || []).find(btn => btn.id === buttonId);
          return button ? button.visibility : "";
        }

        setButtonVisibility(buttonId, visibility) {
            if (visibility !== 'visible' && visibility !== 'hidden') return;
            let buttons = [...this._dynamicButtons];
            let buttonFound = false;
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].id === buttonId) {
                    buttons[i].visibility = visibility;
                    buttonFound = true;
                    break;
                }
            }
            if (!buttonFound) return;
            this.dynamicButtons = JSON.stringify(buttons);
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties: { dynamicButtons: JSON.stringify(buttons) } }
            }));
        }
        
        getSelectedDataValue(key, rowIndex) {
          return this.getSelectedDataValueImpl(key, rowIndex);
        }

        getSelectedDataValueImpl(key, rowIndex) {
          if (!this._selectedData || this._selectedData.length === 0) return "";
          const positionInSelectedRows = this._selectedIndices.indexOf(rowIndex);
          if (positionInSelectedRows === -1) return "";
          if (this._selectedData[positionInSelectedRows] && 
              this._selectedData[positionInSelectedRows][key] != null) {
            return String(this._selectedData[positionInSelectedRows][key]);
          }
          return "";
        }

        // --- UPDATED METHOD ---
        setCardDataValue(originalIndex, dataKey, newValue) {
            if (!this._cardData || this._cardData.length === 0) return;
            if (originalIndex < 0 || originalIndex >= this._cardData.length) return;

            try {
                const dataObject = this._cardData[originalIndex];
                if (dataObject) {
                    dataObject[dataKey] = newValue;
                    
                    // Update selectedData if this card was selected
                    this._updateSelectedData(); 
                    
                    // Re-render all cards to show the change
                    this._renderWidget(); 

                    // Dispatch ONLY selectedData (if it changed) and
                    // other properties that are not the main data source.
                    // DO NOT dispatch 'cardData'.
                    this.dispatchEvent(new CustomEvent("propertiesChanged", {
                        detail: { 
                            properties: { 
                                selectedData: JSON.stringify(this._selectedData)
                            } 
                        }
                    }));
                }
            } catch (e) {
                console.error("Error in setCardDataValue:", e);
            }
        }
   
        get cardData() {
            return JSON.stringify(this._cardData);
        }
        set cardData(value) {
            try {
                this._cardData = JSON.parse(value);
                this._currentPage = 1;
                this._renderWidget();
            } catch (e) {}
        }
        
        get selectedIndices() {
            return JSON.stringify(this._selectedIndices);
        }
        get selectedData() {
            return JSON.stringify(this._selectedData);
        }
        set selectedIndices(value) {
            try {
                this._selectedIndices = JSON.parse(value);
                this._updateSelectedData();
                this._renderWidget();
            } catch (e) {}
        }
        
        get isMultiSelectMode() {
            return this._isMultiSelectMode;
        }
        set isMultiSelectMode(value) {
            const valueChanged = this._isMultiSelectMode !== value;
            this._isMultiSelectMode = value;
            
            if (this._isMultiSelectMode) {
                this._multiSelectButton.style.display = 'none';
                this._cancelButton.style.display = 'flex';
            } else {
                this._multiSelectButton.style.display = 'flex';
                this._cancelButton.style.display = 'none';
            }
            
            if (valueChanged) {
                this.dispatchEvent(new Event("onSelectionModeChange"));
            }
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties: { isMultiSelectMode: value } }
            }));
        }
    }
    customElements.define('planifyit-card-widget', PlanifyITCardWidget);
})();
