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

            .widget-header {
                display: flex;
                align-items: center;
                background-color: #1a73e8;
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

            .action-buttons { /* Kept for structure, but empty */
                display: flex;
                gap: 8px;
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
                flex: 1 1 250px;
                min-width: 220px;
                background-color: var(--card-bg-color);
                border: 1px solid var(--card-border-color);
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                transition: box-shadow 0.3s, border-color 0.3s, background-color 0.3s;
                word-wrap: break-word;
                position: relative;
                padding-left: 50px; /* Space for the icon */
                padding-right: 40px; /* Space for buttons */
                cursor: pointer; /* Make card clickable again */
                min-height: 40px;
            }

            .card:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .card.selected {
                background-color: var(--selected-card-bg-color);
                border-color: var(--selected-card-border-color);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }

            .card-icon {
                position: absolute;
                top: 12px;
                left: 10px;
                width: 30px;
                height: 30px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #1a73e8; /* Default color */
            }
            
            .card-content {
                display: flex;
                flex-direction: column;
            }

            .card-row {
                margin-bottom: 6px;
            }
            
            .card-row-title {
                font-weight: bold;
                font-size: 1.1em;
                color: var(--card-title-color);
                margin-bottom: 8px;
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
            .symbol { display: inline-block; text-align: center; }
            .symbol-folder { color: inherit; } 
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
                flex-direction: row;
                gap: 4px;
                z-index: 5;
            }
            
            .dynamic-button {
                display: flex;
                border: none;
                border-radius: 4px;
                color: #555;
                cursor: pointer;
                transition: background-color 0.3s, color 0.3s;
                font-size: 18px;
                width: 28px;
                height: 28px;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                margin-right: 0;
                padding: 0;
            }
            
            .dynamic-button:hover {
                background-color: #f0f0f0;
                color: #111;
            }
        </style>

        <div class="widget-container">
            <div class="widget-header">
                <div id="widgetHeaderTitle" class="widget-header-title">Card List</div>
                <div class="action-buttons">
                    </div>
            </div>
            
            <div class="card-container" id="cardContainer">
                <div class="no-data-message">No data available</div>
            </div>

            <div class="pagination-controls" id="paginationControls">
                </div>
        </div>
    `;

    class SimpleCardWidget extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
     
            // Internal tracking
            this._props = {}; 
            this._cardData = [];
            this._dataStructure = [];
            this._cardLayout = [];
            this._cardIcon = {};
            this._selectedIndices = []; 
            this._selectedData = [];    
            this._dynamicButtons = []; 
            this._initialized = false;
            this._lastClickedButtonId = null;
            this._symbolMap = this._buildSymbolMap();
            this._cardsPerPage = 10;
            this._currentPage = 1;

            // Get DOM elements
            this._cardContainer = this._shadowRoot.getElementById('cardContainer');
            this._paginationControls = this._shadowRoot.getElementById('paginationControls');
            this._headerTitle = this._shadowRoot.getElementById('widgetHeaderTitle');
            // Remove reference to _actionButtons
        }

        // --- Symbol Logic (Unchanged) ---
        
        _getSymbols() {
             return [
                { value: 'folder', label: '📁 Folder' },
                { value: 'check', label: '✓ Check' }, { value: 'x', label: '✕ X' },
                { value: 'arrow-up', label: '↑ Arrow Up' }, { value: 'arrow-down', label: '↓ Arrow Down' },
                { value: 'minus', label: '- Minus' }, { value: 'plus', label: '+ Plus' },
                { value: 'bell', label: '🔔 Bell' }, { value: 'warning', label: '⚠ Warning' },
                { value: 'info', label: 'ℹ Info' }, { value: 'flag', label: '⚑ Flag' },
                { value: 'lock', label: '🔒 Lock' }, { value: 'calendar', label: '📅 Calendar' },
                { value: 'search', label: '🔍 Search' }, { value: 'edit-pencil', label: '✏️ Edit' },
                { value: 'change', label: '🔄 Change' }, { value: 'star', label: '⭐ Star' }
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

        // --- Selection Logic (Unchanged) ---

        _handleCardClick(originalIndex, dataObject) {
            if (this._selectedIndices.includes(originalIndex)) {
                this._selectedIndices = []; 
            } else {
                this._selectedIndices = [originalIndex]; 
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

        // --- Main Rendering Logic (Unchanged) ---

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
            const buttonsConfig = typeof this._dynamicButtons === 'string' ? JSON.parse(this._dynamicButtons) : (this._dynamicButtons || []);
            const iconConfig = typeof this._cardIcon === 'string' ? JSON.parse(this._cardIcon) : (this._cardIcon || {});
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
                if (this._selectedIndices.includes(originalIndex)) card.classList.add('selected');
                card.addEventListener('click', () => this._handleCardClick(originalIndex, dataObject));
                if (iconConfig.symbol) {
                    const iconContainer = document.createElement('div'); iconContainer.className = 'card-icon';
                    if (iconConfig.color) iconContainer.style.color = iconConfig.color;
                    iconContainer.appendChild(this._createSymbolElement({ type: iconConfig.symbol, symbol: this._symbolMap[iconConfig.symbol] || '●' }));
                    card.appendChild(iconContainer);
                }
                const cardContent = document.createElement('div'); cardContent.className = 'card-content';
                sortedLayout.forEach(rowConfig => {
                    const value = dataObject[rowConfig.dataKey] || ''; const rowEl = document.createElement('div'); rowEl.className = 'card-row';
                    switch (rowConfig.type) {
                        case 'Title': rowEl.classList.add('card-row-title'); rowEl.textContent = value; cardContent.appendChild(rowEl); break;
                        case 'Text': rowEl.classList.add('card-row-text'); rowEl.innerHTML = `<span class="card-row-label">${rowConfig.label || rowConfig.dataKey}:</span>`; rowEl.appendChild(document.createTextNode(value)); cardContent.appendChild(rowEl); break;
                    }
                });
                card.appendChild(cardContent);
                const cardButtonsContainer = document.createElement('div'); cardButtonsContainer.className = 'card-buttons-container';
                if (Array.isArray(buttonsConfig)) {
                    buttonsConfig.forEach(buttonConfig => {
                        if (buttonConfig.id && buttonConfig.visibility !== 'hidden') {
                            const button = document.createElement('button'); button.className = 'dynamic-button'; button.title = buttonConfig.tooltip || buttonConfig.id; button.textContent = this._symbolMap[buttonConfig.symbol] || '●';
                            if (buttonConfig.backgroundColor && buttonConfig.backgroundColor.trim() !== '') { button.style.backgroundColor = buttonConfig.backgroundColor; button.style.color = '#ffffff'; }
                            button.addEventListener('click', (e) => {
                                e.stopPropagation(); this._lastClickedButtonId = buttonConfig.id; this.lastClickedButtonId = buttonConfig.id;
                                this.dispatchEvent(new CustomEvent("onCustomButtonClicked", { detail: { buttonId: buttonConfig.id, buttonConfig: buttonConfig, originalIndex: originalIndex, dataObject: dataObject } }));
                                this.dispatchEvent(new CustomEvent("propertiesChanged", { detail: { properties: { lastClickedButtonId: buttonConfig.id } } }));
                            }); cardButtonsContainer.appendChild(button);
                        }
                    });
                }
                card.appendChild(cardButtonsContainer);
                this._cardContainer.appendChild(card);
            });
        }

        _renderPagination() {
            this._paginationControls.innerHTML = '';
            const totalPages = Math.ceil(this._cardData.length / this._cardsPerPage);
            if (totalPages <= 1) return;
            const prevButton = document.createElement('button'); prevButton.className = 'pagination-button'; prevButton.textContent = '◀ Prev'; if (this._currentPage === 1) prevButton.disabled = true; prevButton.addEventListener('click', () => this._changePage(this._currentPage - 1)); this._paginationControls.appendChild(prevButton);
            const pageInfo = document.createElement('span'); pageInfo.className = 'pagination-info'; pageInfo.textContent = `Page ${this._currentPage} of ${totalPages}`; this._paginationControls.appendChild(pageInfo);
            const nextButton = document.createElement('button'); nextButton.className = 'pagination-button'; nextButton.textContent = 'Next ▶'; if (this._currentPage === totalPages) nextButton.disabled = true; nextButton.addEventListener('click', () => this._changePage(this._currentPage + 1)); this._paginationControls.appendChild(nextButton);
        }

        _changePage(newPage) {
            if (newPage < 1 || newPage > Math.ceil(this._cardData.length / this._cardsPerPage)) return;
            this._currentPage = newPage;
            this._renderWidget();
        }
        
        // --- SAC Lifecycle Hooks & Data Binding (Unchanged) ---
        
        connectedCallback() {
            if (!this._initialized) {
                this._initialized = true;
                if (this.hasAttribute("dynamicButtons")) { try { this._dynamicButtons = JSON.parse(this.getAttribute("dynamicButtons")); } catch (e) {} }
                if (this.hasAttribute("cardIcon")) { try { this._cardIcon = JSON.parse(this.getAttribute("cardIcon")); } catch (e) {} }
                if (this.hasAttribute("cardLayout")) { try { this._cardLayout = JSON.parse(this.getAttribute("cardLayout")); } catch (e) {} }
                if (this.hasAttribute("cardsPerPage")) { this._cardsPerPage = parseInt(this.getAttribute("cardsPerPage"), 10) || 10; }
                if (this.hasAttribute("headerTitle")) { this._headerTitle.textContent = this.getAttribute("headerTitle"); }
                if (this.hasAttribute("selectedIndices")) { try { this._selectedIndices = JSON.parse(this.getAttribute("selectedIndices")); } catch (e) {} }
                if (this.cardDataBinding) { this._updateDataBinding(this.cardDataBinding); }
            }
            this._renderWidget();
        }
        
        onCustomWidgetBeforeUpdate(changedProperties) { this._props = { ...this._props, ...changedProperties }; }
        
        _updateDataBinding(dataBinding) {
            if (dataBinding && dataBinding.state === 'success' && Array.isArray(dataBinding.data)) {
                const columns = [];
                const dims = dataBinding.metadata && dataBinding.metadata.dimensions; if (dims && typeof dims === "object" && !Array.isArray(dims)) Object.keys(dims).forEach(dimKey => columns.push({ name: dimKey, label: dims[dimKey].description || dims[dimKey].label || dims[dimKey].id }));
                const measures = dataBinding.metadata && dataBinding.metadata.mainStructureMembers; if (measures && typeof measures === "object" && !Array.isArray(measures)) Object.keys(measures).forEach(measKey => columns.push({ name: measKey, label: measures[measKey].label || measures[measKey].id }));
                const cardData = dataBinding.data.map((row) => { const transformedRow = {}; columns.forEach(col => { let cellObj = row[col.name]; transformedRow[col.name] = cellObj ? (cellObj.label || cellObj.formattedValue || cellObj.formatted || cellObj.raw || "") : ""; }); return transformedRow; });
                this._dataStructure = columns; this._cardData = cardData; this._currentPage = 1; this._selectedIndices = []; this._updateSelectedData(); this._renderWidget();
            }
        }
        
        onCustomWidgetAfterUpdate(changedProperties) {
            if ("cardDataBinding" in changedProperties) this._updateDataBinding(changedProperties.cardDataBinding);
            if ('cardData' in changedProperties) { try { this._cardData = JSON.parse(changedProperties.cardData); this._currentPage = 1; this._selectedIndices = []; this._updateSelectedData(); this._renderWidget(); } catch (e) {} }
            if ('cardIcon' in changedProperties) { try { this._cardIcon = JSON.parse(changedProperties.cardIcon); } catch (e) { this._cardIcon = {}; } this._renderWidget(); }
            if ('cardLayout' in changedProperties) { try { this._cardLayout = JSON.parse(changedProperties.cardLayout); } catch (e) {} this._renderWidget(); }
            if ('cardsPerPage' in changedProperties) { this._cardsPerPage = parseInt(changedProperties.cardsPerPage, 10) || 10; this._currentPage = 1; this._renderWidget(); }
            if ('dynamicButtons' in changedProperties) { try { this._dynamicButtons = typeof changedProperties.dynamicButtons === 'string' ? JSON.parse(changedProperties.dynamicButtons) : changedProperties.dynamicButtons; } catch (e) {} this._renderWidget(); }
            if ('headerTitle' in changedProperties) this._headerTitle.textContent = changedProperties.headerTitle;
            if ('selectedIndices' in changedProperties) { try { this._selectedIndices = JSON.parse(changedProperties.selectedIndices); this._updateSelectedData(); this._renderWidget(); } catch (e) { console.error('Invalid selectedIndices property:', e); } }
            const hostStyle = this._shadowRoot.host.style;
            if ('cardBackgroundColor' in changedProperties) hostStyle.setProperty('--card-bg-color', changedProperties.cardBackgroundColor);
            if ('cardBorderColor' in changedProperties) hostStyle.setProperty('--card-border-color', changedProperties.cardBorderColor);
            if ('selectedCardColor' in changedProperties) hostStyle.setProperty('--selected-card-bg-color', changedProperties.selectedCardColor);
            if ('cardTitleColor' in changedProperties) hostStyle.setProperty('--card-title-color', changedProperties.cardTitleColor);
            if ('cardTextColor' in changedProperties) hostStyle.setProperty('--card-text-color', changedProperties.cardTextColor);
        }

        // --- Public Getters/Setters (Unchanged) ---

        get dynamicButtons() { return typeof this._dynamicButtons === 'string' ? this._dynamicButtons : JSON.stringify(this._dynamicButtons); }
        set dynamicButtons(value) { try { this._dynamicButtons = typeof value === 'string' ? JSON.parse(value) : value; } catch (e) {} this._renderWidget(); }
        get lastClickedButtonId() { return this._lastClickedButtonId || ''; }
        set lastClickedButtonId(value) { this._lastClickedButtonId = value; this.dispatchEvent(new CustomEvent("propertiesChanged", { detail: { properties: { lastClickedButtonId: value } } })); }
        getButtonVisibility(buttonId) { const button = (this._dynamicButtons || []).find(btn => btn.id === buttonId); return button ? button.visibility : ""; }
        setButtonVisibility(buttonId, visibility) { if (visibility !== 'visible' && visibility !== 'hidden') return; let buttons = [...this._dynamicButtons]; let bf = false; for (let i=0;i<buttons.length; i++){ if(buttons[i].id === buttonId){ buttons[i].visibility = visibility; bf=true; break; } } if(!bf) return; this.dynamicButtons = JSON.stringify(buttons); this.dispatchEvent(new CustomEvent("propertiesChanged", { detail: { properties: { dynamicButtons: JSON.stringify(buttons) } } })); }
        getCardDataValue(key, originalIndex) { if (!this._cardData || originalIndex < 0 || originalIndex >= this._cardData.length) return ""; try { const d=this._cardData[originalIndex]; return (d && d[key] != null)?String(d[key]):""; } catch (e) { console.error("Error in getCardDataValue:", e); return ""; } }
        getSelectedDataValue(key) { if (!this._selectedData || this._selectedData.length === 0) return ""; const s = this._selectedData[0]; return (s && s[key] != null)?String(s[key]):""; }
        setCardDataValue(originalIndex, dataKey, newValue) { if (!this._cardData || originalIndex < 0 || originalIndex >= this._cardData.length) return; try { const d=this._cardData[originalIndex]; if (d) { d[dataKey] = newValue; this._updateSelectedData(); this._renderWidget(); } } catch (e) { console.error("Error in setCardDataValue:", e); } }
        get cardData() { return JSON.stringify(this._cardData); }
        set cardData(value) { try { this._cardData = JSON.parse(value); this._currentPage = 1; this._selectedIndices = []; this._updateSelectedData(); this._renderWidget(); } catch (e) {} }
        get selectedIndices() { return JSON.stringify(this._selectedIndices); }
        get selectedData() { return JSON.stringify(this._selectedData); }
        set selectedIndices(value) { try { this._selectedIndices = JSON.parse(value); this._updateSelectedData(); this._renderWidget(); } catch (e) {} }
    }
    customElements.define('simple-card-widget', SimpleCardWidget);
})();
