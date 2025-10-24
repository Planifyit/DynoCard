(function() {
    let template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 1em;
            }
            fieldset {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 12px;
                margin-bottom: 12px;
            }
            legend {
                font-weight: bold;
                font-size: 14px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            td {
                padding: 8px;
                vertical-align: middle;
            }
            input[type="text"], input[type="color"], input[type="number"], select {
                width: 100%;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            input[type="color"] {
                width: 40px;
                height: 24px;
                padding: 0;
            }
            input[type="number"] {
                width: 60px;
            }
            select {
                height: 30px;
            }
            .color-row {
                display: flex;
                align-items: center;
            }
            .color-input {
                flex-grow: 1;
                margin-right: 5px;
            }
            .card-row-config, .button-container {
                margin-top: 15px;
            }
            .row-entry, .button-entry {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                gap: 8px;
            }
            .order-input, .label-input, .datakey-input {
                flex-grow: 1;
            }
            .order-input {
                width: 50px;
                flex-grow: 0;
            }
            .symbol-select, .button-symbol-select {
                flex-grow: 1;
            }
            .button-id-input, .button-tooltip-input {
                flex-grow: 1;
            }
            .add-button, .remove-button {
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px 8px;
                font-size: 14px;
            }
            .add-button {
                margin-top: 8px;
            }
            .remove-button {
                background-color: #ffebee;
            }
            .apply-button {
                background-color: #1a73e8;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            }
            .apply-button:hover {
                background-color: #1557b0;
            }
            .move-buttons {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .move-button {
                background-color: #e0e0e0;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                padding: 2px 6px;
                font-size: 12px;
                width: 24px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .move-button:hover {
                background-color: #d0d0d0;
            }
        </style>
        <form id="form">
            <fieldset>
                <legend>Text Content</legend>
                <table>
                    <tr>
                        <td>Card Header Title</td>
                        <td>
                            <input id="style_header_title" type="text" placeholder="Enter header title">
                        </td>
                    </tr>
                    <tr>
                        <td>App Title</td>
                        <td>
                            <input id="style_app_title" type="text" placeholder="Enter app title">
                        </td>
                    </tr>
                </table>
            </fieldset>
            
            <fieldset>
                <legend>Card Appearance</legend>
                <table>
                    <tr>
                        <td>Header Background Color</td>
                        <td class="color-row">
                            <input id="style_header_color" type="text" class="color-input">
                            <input id="style_header_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Header Text Color</td>
                        <td class="color-row">
                            <input id="style_header_text_color" type="text" class="color-input">
                            <input id="style_header_text_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Card Background Color</td>
                        <td class="color-row">
                            <input id="style_card_background_color" type="text" class="color-input">
                            <input id="style_card_background_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Card Hover Color</td>
                        <td class="color-row">
                            <input id="style_card_hover_color" type="text" class="color-input">
                            <input id="style_card_hover_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Selected Card Border Color</td>
                        <td class="color-row">
                            <input id="style_selected_card_color" type="text" class="color-input">
                            <input id="style_selected_card_color_picker" type="color">
                        </td>
                    </tr>
                </table>
            </fieldset>
            
            <fieldset>
                <legend>Card Row Configuration</legend>
                <div class="card-row-config" id="card_row_container">
                    <!-- Card row entries will be added here dynamically -->
                </div>
                <button type="button" id="add_card_row" class="add-button">+ Add Card Row</button>
            </fieldset>

            <fieldset>
                <legend>Pagination Settings</legend>
                <table>
                    <tr>
                        <td>Cards Per Page</td>
                        <td>
                            <input id="style_cards_per_page" type="number" min="1" max="50" value="12">
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Create Buttons</legend>
                <div class="button-container" id="button_container">
                    <!-- Button entries will be added here dynamically -->
                </div>
                <button type="button" id="add_button" class="add-button">+ Add Custom Button</button>
            </fieldset>
            
            <button type="button" id="apply_styles" class="apply-button">Apply Styles</button>
            <input type="submit" style="display:none;">
        </form>
    `;

    class StylePanel extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            
            this._form = this._shadowRoot.getElementById("form");
            
            // Text inputs
            this._headerTitleInput = this._shadowRoot.getElementById("style_header_title");
            this._appTitleInput = this._shadowRoot.getElementById("style_app_title");
            this._cardsPerPageInput = this._shadowRoot.getElementById("style_cards_per_page");
            
            // Color inputs
            this._headerColorInput = this._shadowRoot.getElementById("style_header_color");
            this._headerColorPicker = this._shadowRoot.getElementById("style_header_color_picker");
            
            this._headerTextColorInput = this._shadowRoot.getElementById("style_header_text_color");
            this._headerTextColorPicker = this._shadowRoot.getElementById("style_header_text_color_picker");
            
            this._cardBackgroundColorInput = this._shadowRoot.getElementById("style_card_background_color");
            this._cardBackgroundColorPicker = this._shadowRoot.getElementById("style_card_background_color_picker");
            
            this._cardHoverColorInput = this._shadowRoot.getElementById("style_card_hover_color");
            this._cardHoverColorPicker = this._shadowRoot.getElementById("style_card_hover_color_picker");
            
            this._selectedCardColorInput = this._shadowRoot.getElementById("style_selected_card_color");
            this._selectedCardColorPicker = this._shadowRoot.getElementById("style_selected_card_color_picker");
            
            // Card rows and buttons
            this._cardRowContainer = this._shadowRoot.getElementById("card_row_container");
            this._addCardRowButton = this._shadowRoot.getElementById("add_card_row");
            
            this._buttonContainer = this._shadowRoot.getElementById("button_container");
            this._addButtonButton = this._shadowRoot.getElementById("add_button");
            
            this._applyButton = this._shadowRoot.getElementById("apply_styles");
            
            this._cardRows = [];
            this._dynamicButtons = [];
            
            this._connectColorPickers();
            
            // Event listeners
            this._form.addEventListener("submit", this._submit.bind(this));
            this._applyButton.addEventListener("click", this._submit.bind(this));
            this._addCardRowButton.addEventListener("click", () => this._addCardRowEntry());
            this._addButtonButton.addEventListener("click", () => this._addButtonEntry());
            
            // Add initial entries
            this._addCardRowEntry();
            this._addButtonEntry();
        }
        
        _connectColorPickers() {
            this._headerColorPicker.addEventListener("input", () => {
                this._headerColorInput.value = this._headerColorPicker.value;
            });
            this._headerColorInput.addEventListener("change", () => {
                this._headerColorPicker.value = this._headerColorInput.value;
            });
            
            this._headerTextColorPicker.addEventListener("input", () => {
                this._headerTextColorInput.value = this._headerTextColorPicker.value;
            });
            this._headerTextColorInput.addEventListener("change", () => {
                this._headerTextColorPicker.value = this._headerTextColorInput.value;
            });
            
            this._cardBackgroundColorPicker.addEventListener("input", () => {
                this._cardBackgroundColorInput.value = this._cardBackgroundColorPicker.value;
            });
            this._cardBackgroundColorInput.addEventListener("change", () => {
                this._cardBackgroundColorPicker.value = this._cardBackgroundColorInput.value;
            });
            
            this._cardHoverColorPicker.addEventListener("input", () => {
                this._cardHoverColorInput.value = this._cardHoverColorPicker.value;
            });
            this._cardHoverColorInput.addEventListener("change", () => {
                this._cardHoverColorPicker.value = this._cardHoverColorInput.value;
            });
            
            this._selectedCardColorPicker.addEventListener("input", () => {
                this._selectedCardColorInput.value = this._selectedCardColorPicker.value;
            });
            this._selectedCardColorInput.addEventListener("change", () => {
                this._selectedCardColorPicker.value = this._selectedCardColorInput.value;
            });
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

        _addCardRowEntry(order = '', label = '', symbol = '', dataKey = '') {
            const entry = document.createElement("div");
            entry.className = "row-entry";
            
            const orderInput = document.createElement("input");
            orderInput.type = "number";
            orderInput.min = "0";
            orderInput.className = "order-input";
            orderInput.placeholder = "Order";
            orderInput.value = order;
            orderInput.title = "Display order";
            
            const labelInput = document.createElement("input");
            labelInput.type = "text";
            labelInput.className = "label-input";
            labelInput.placeholder = "Row Label";
            labelInput.value = label;
            
            const symbolSelect = document.createElement("select");
            symbolSelect.className = "symbol-select";
            
            const noneOption = document.createElement("option");
            noneOption.value = "";
            noneOption.textContent = "No Symbol";
            symbolSelect.appendChild(noneOption);
            
            const symbols = this._getSymbols();
            symbols.forEach(sym => {
                const option = document.createElement("option");
                option.value = sym.value;
                option.textContent = sym.label;
                if (sym.value === symbol) {
                    option.selected = true;
                }
                symbolSelect.appendChild(option);
            });
            
            const dataKeyInput = document.createElement("input");
            dataKeyInput.type = "text";
            dataKeyInput.className = "datakey-input";
            dataKeyInput.placeholder = "Data Key";
            dataKeyInput.value = dataKey;
            dataKeyInput.title = "Key to retrieve data from (e.g., dimensions_0)";
            
            const moveButtons = document.createElement("div");
            moveButtons.className = "move-buttons";
            
            const moveUpButton = document.createElement("button");
            moveUpButton.type = "button";
            moveUpButton.className = "move-button";
            moveUpButton.textContent = "▲";
            moveUpButton.addEventListener("click", () => {
                const parent = entry.parentNode;
                const previous = entry.previousElementSibling;
                if (previous) {
                    parent.insertBefore(entry, previous);
                    this._updateCardRowsState();
                }
            });
            
            const moveDownButton = document.createElement("button");
            moveDownButton.type = "button";
            moveDownButton.className = "move-button";
            moveDownButton.textContent = "▼";
            moveDownButton.addEventListener("click", () => {
                const parent = entry.parentNode;
                const next = entry.nextElementSibling;
                if (next) {
                    parent.insertBefore(next, entry);
                    this._updateCardRowsState();
                }
            });
            
            moveButtons.appendChild(moveUpButton);
            moveButtons.appendChild(moveDownButton);
            
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "✕";
            removeButton.addEventListener("click", () => {
                this._cardRowContainer.removeChild(entry);
                this._updateCardRowsState();
            });
            
            entry.appendChild(orderInput);
            entry.appendChild(labelInput);
            entry.appendChild(symbolSelect);
            entry.appendChild(dataKeyInput);
            entry.appendChild(moveButtons);
            entry.appendChild(removeButton);
            
            this._cardRowContainer.appendChild(entry);
        }

        _updateCardRowsState() {
            this._cardRows = [];
            const entries = this._cardRowContainer.querySelectorAll(".row-entry");
            
            entries.forEach((entry, index) => {
                const orderInput = entry.querySelector(".order-input");
                const labelInput = entry.querySelector(".label-input");
                const symbolSelect = entry.querySelector(".symbol-select");
                const dataKeyInput = entry.querySelector(".datakey-input");
                
                if (labelInput.value || dataKeyInput.value) {
                    this._cardRows.push({
                        order: orderInput.value ? parseInt(orderInput.value, 10) : index,
                        label: labelInput.value || '',
                        symbol: symbolSelect.value || '',
                        dataKey: dataKeyInput.value || ''
                    });
                }
            });
            
            return this._cardRows;
        }

        _addButtonEntry(buttonId = '', tooltip = '', symbolType = 'info', visibility = 'visible', backgroundColor = '') {
            const entry = document.createElement("div");
            entry.className = "button-entry";
            
            const buttonIdInput = document.createElement("input");
            buttonIdInput.type = "text";
            buttonIdInput.className = "button-id-input";
            buttonIdInput.placeholder = "Button ID";
            buttonIdInput.value = buttonId;
            
            const tooltipInput = document.createElement("input");
            tooltipInput.type = "text";
            tooltipInput.className = "button-tooltip-input";
            tooltipInput.placeholder = "Tooltip description";
            tooltipInput.value = tooltip;

            const visibilitySelect = document.createElement("select");
            visibilitySelect.className = "button-visibility-select";
            
            const visibilityOptions = [
                { value: 'visible', label: 'Visible' },
                { value: 'hidden', label: 'Hidden' }
            ];
            
            visibilityOptions.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                if (option.value === visibility) {
                    optionElement.selected = true;
                }
                visibilitySelect.appendChild(optionElement);
            });
            
            const symbolSelect = document.createElement("select");
            symbolSelect.className = "button-symbol-select";
            
            const symbols = this._getSymbols();
            symbols.forEach(symbol => {
                const option = document.createElement("option");
                option.value = symbol.value;
                option.textContent = symbol.label;
                if (symbol.value === symbolType) {
                    option.selected = true;
                }
                symbolSelect.appendChild(option);
            });
            
            const colorRow = document.createElement("div");
            colorRow.className = "color-row";

            const colorInput = document.createElement("input");
            colorInput.type = "text";
            colorInput.className = "button-color-input color-input";
            colorInput.placeholder = "#RRGGBB";
            colorInput.value = backgroundColor || '';

            const colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.className = "button-color-picker";
            colorPicker.value = backgroundColor || '#FFFFFF';

            colorPicker.addEventListener("input", () => {
                colorInput.value = colorPicker.value;
            });
            colorInput.addEventListener("change", () => {
                colorPicker.value = colorInput.value;
            });

            colorRow.appendChild(colorInput);
            colorRow.appendChild(colorPicker);
            
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "✕";
            removeButton.addEventListener("click", () => {
                this._buttonContainer.removeChild(entry);
                this._updateButtonsState();
            });
            
            entry.appendChild(buttonIdInput);
            entry.appendChild(tooltipInput);
            entry.appendChild(symbolSelect);
            entry.appendChild(visibilitySelect);
            entry.appendChild(colorRow);
            entry.appendChild(removeButton);
            
            this._buttonContainer.appendChild(entry);
        }

        _updateButtonsState() {
            this._dynamicButtons = [];
            const entries = this._buttonContainer.querySelectorAll(".button-entry");
            
            entries.forEach(entry => {
                const buttonIdInput = entry.querySelector(".button-id-input");
                const tooltipInput = entry.querySelector(".button-tooltip-input");
                const symbolSelect = entry.querySelector(".button-symbol-select");
                const visibilitySelect = entry.querySelector(".button-visibility-select");
                const colorInput = entry.querySelector(".button-color-input");
                
                if (buttonIdInput.value) {
                    this._dynamicButtons.push({
                        id: buttonIdInput.value,
                        tooltip: tooltipInput.value || '',
                        symbol: symbolSelect.value,
                        visibility: visibilitySelect.value,
                        backgroundColor: colorInput.value || ''
                    });
                }
            });
            
            return this._dynamicButtons;
        }

        _submit(e) {
            e.preventDefault();
            
            const cardRows = this._updateCardRowsState();
            const dynamicButtons = this._updateButtonsState();

            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        headerTitle: this.headerTitle,
                        appTitle: this.appTitle,
                        headerColor: this.headerColor,
                        headerTextColor: this.headerTextColor,
                        cardBackgroundColor: this.cardBackgroundColor,
                        cardHoverColor: this.cardHoverColor,
                        selectedCardColor: this.selectedCardColor,
                        cardsPerPage: parseInt(this._cardsPerPageInput.value, 10),
                        cardRows: JSON.stringify(cardRows),
                        dynamicButtons: JSON.stringify(dynamicButtons)
                    }
                }
            }));
        }

        set cardRows(value) {
            try {
                this._cardRowContainer.innerHTML = '';
                const rows = JSON.parse(value);
                
                if (Array.isArray(rows) && rows.length > 0) {
                    rows.forEach(row => {
                        this._addCardRowEntry(
                            row.order || '',
                            row.label || '',
                            row.symbol || '',
                            row.dataKey || ''
                        );
                    });
                } else {
                    this._addCardRowEntry();
                }
                
                this._cardRows = rows;
            } catch (e) {
                this._addCardRowEntry();
            }
        }
        
        get cardRows() {
            return JSON.stringify(this._updateCardRowsState());
        }

        set dynamicButtons(value) {
            try {
                this._buttonContainer.innerHTML = '';
                const buttons = JSON.parse(value);
                
                if (Array.isArray(buttons) && buttons.length > 0) {
                    buttons.forEach(button => {
                        this._addButtonEntry(
                            button.id || '',
                            button.tooltip || '',
                            button.symbol || 'info',
                            button.visibility || 'visible',
                            button.backgroundColor || ''
                        );
                    });
                } else {
                    this._addButtonEntry();
                }
                
                this._dynamicButtons = buttons;
            } catch (e) {
                this._addButtonEntry();
            }
        }
        
        get dynamicButtons() {
            return JSON.stringify(this._updateButtonsState());
        }
        
        get headerTitle() {
            return this._headerTitleInput.value;
        }
        
        set headerTitle(value) {
            this._headerTitleInput.value = value || '';
        }
        
        get appTitle() {
            return this._appTitleInput.value;
        }
        
        set appTitle(value) {
            this._appTitleInput.value = value || '';
        }
        
        get headerColor() {
            return this._headerColorInput.value;
        }
        
        set headerColor(value) {
            this._headerColorInput.value = value;
            this._headerColorPicker.value = value;
        }
        
        get headerTextColor() {
            return this._headerTextColorInput.value;
        }
        
        set headerTextColor(value) {
            this._headerTextColorInput.value = value;
            this._headerTextColorPicker.value = value;
        }
        
        get cardBackgroundColor() {
            return this._cardBackgroundColorInput.value;
        }
        
        set cardBackgroundColor(value) {
            this._cardBackgroundColorInput.value = value;
            this._cardBackgroundColorPicker.value = value;
        }
        
        get cardHoverColor() {
            return this._cardHoverColorInput.value;
        }
        
        set cardHoverColor(value) {
            this._cardHoverColorInput.value = value;
            this._cardHoverColorPicker.value = value;
        }
        
        get selectedCardColor() {
            return this._selectedCardColorInput.value;
        }
        
        set selectedCardColor(value) {
            this._selectedCardColorInput.value = value;
            this._selectedCardColorPicker.value = value;
        }

        get cardsPerPage() {
            return parseInt(this._cardsPerPageInput.value, 10);
        }
        
        set cardsPerPage(value) {
            this._cardsPerPageInput.value = value || 12;
        }
    }

    customElements.define("com-planifyit-card-styling", StylePanel);
})();
