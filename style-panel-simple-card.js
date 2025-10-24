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
                box-sizing: border-box;
            }
            input[type="color"] {
                width: 40px;
                height: 24px;
                padding: 0;
            }
            input[type="number"] {
                width: 70px;
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
            .card-layout-config, .button-container {
                margin-top: 15px;
            }
            .card-row-entry, .button-entry {
                display: flex;
                flex-direction: column;
                border: 1px solid #eee;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 8px;
                gap: 8px;
            }
            .card-row-grid, .button-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .full-width {
                grid-column: 1 / -1;
            }
            
            .add-button, .remove-button {
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px 8px;
                font-size: 14px;
                width: fit-content;
            }
            .add-button {
                margin-top: 8px;
            }
            .remove-button {
                background-color: #ffebee;
                align-self: flex-end;
            }
        </style>
        <form id="form">
            <fieldset>
                <legend>General</legend>
                <table>
                    <tr>
                        <td>Header Title</td>
                        <td>
                            <input id="style_header_title" type="text" placeholder="Enter header title">
                        </td>
                    </tr>
                </table>
            </fieldset>
            
            <fieldset>
                <legend>Card Icon</legend>
                <table>
                    <tr>
                        <td>Icon</td>
                        <td>
                            <select id="style_icon_symbol"></select>
                        </td>
                    </tr>
                    <tr>
                        <td>Icon Color</td>
                        <td class="color-row">
                            <input id="style_icon_color" type="text" class="color-input">
                            <input id="style_icon_color_picker" type="color">
                        </td>
                    </tr>
                </table>
            </fieldset>
            
            <fieldset>
                <legend>Card Appearance</legend>
                <table>
                    <tr>
                        <td>Card Background</td>
                        <td class="color-row">
                            <input id="style_card_bg_color" type="text" class="color-input">
                            <input id="style_card_bg_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Card Border</td>
                        <td class="color-row">
                            <input id="style_card_border_color" type="text" class="color-input">
                            <input id="style_card_border_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Card Title Color</td>
                        <td class="color-row">
                            <input id="style_card_title_color" type="text" class="color-input">
                            <input id="style_card_title_color_picker" type="color">
                        </td>
                    </tr>
                    <tr>
                        <td>Card Text Color</td>
                        <td class="color-row">
                            <input id="style_card_text_color" type="text" class="color-input">
                            <input id="style_card_text_color_picker" type="color">
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Pagination</legend>
                <table>
                    <tr>
                        <td>Cards Per Page</td>
                        <td>
                            <input id="style_cards_per_page" type="number" min="1" max="100" value="10">
                        </td>
                    </tr>
                </table>
            </fieldset>
            
            <fieldset>
                <legend>Card Layout</legend>
                <div class="card-layout-config" id="card_layout_container">
                    </div>
                <button type="button" id="add_card_row" class="add-button">+ Add Card Row</button>
            </fieldset>

            <fieldset>
                <legend>Create Buttons (for each card)</legend>
                <div class="button-container" id="button_container">
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
            
            // General
            this._headerTitleInput = this._shadowRoot.getElementById("style_header_title");

            // Card Icon
            this._iconSymbolSelect = this._shadowRoot.getElementById("style_icon_symbol");
            this._iconColorInput = this._shadowRoot.getElementById("style_icon_color");
            this._iconColorPicker = this._shadowRoot.getElementById("style_icon_color_picker");

            // Card Appearance
            this._cardBgColorInput = this._shadowRoot.getElementById("style_card_bg_color");
            this._cardBgColorPicker = this._shadowRoot.getElementById("style_card_bg_color_picker");
            this._cardBorderColorInput = this._shadowRoot.getElementById("style_card_border_color");
            this._cardBorderColorPicker = this._shadowRoot.getElementById("style_card_border_color_picker");
            this._cardTitleColorInput = this._shadowRoot.getElementById("style_card_title_color");
            this._cardTitleColorPicker = this._shadowRoot.getElementById("style_card_title_color_picker");
            this._cardTextColorInput = this._shadowRoot.getElementById("style_card_text_color");
            this._cardTextColorPicker = this._shadowRoot.getElementById("style_card_text_color_picker");

            // Pagination
            this._cardsPerPageInput = this._shadowRoot.getElementById("style_cards_per_page");

            // Card Layout
            this._cardLayoutContainer = this._shadowRoot.getElementById("card_layout_container");
            this._addCardRowButton = this._shadowRoot.getElementById("add_card_row");

            // Dynamic buttons
            this._buttonContainer = this._shadowRoot.getElementById("button_container");
            this._addButtonButton = this._shadowRoot.getElementById("add_button");
            
            this._applyButton = this._shadowRoot.getElementById("apply_styles");
            
            this._cardLayout = [];
            this._dynamicButtons = [];
   
            this._populateSymbols();
            this._connectColorPickers();
            
            this._form.addEventListener("submit", this._submit.bind(this));
            this._applyButton.addEventListener("click", this._submit.bind(this));
            this._addCardRowButton.addEventListener("click", () => this._addCardRowEntry());
            this._addButtonButton.addEventListener("click", () => this._addButtonEntry());
            
            this._addCardRowEntry();
            this._addButtonEntry();
        }
        
        _connectColorPickers() {
            const connect = (textInput, pickerInput) => {
                pickerInput.addEventListener("input", () => textInput.value = pickerInput.value);
                textInput.addEventListener("change", () => pickerInput.value = textInput.value);
            };
            connect(this._iconColorInput, this._iconColorPicker);
            connect(this._cardBgColorInput, this._cardBgColorPicker);
            connect(this._cardBorderColorInput, this._cardBorderColorPicker);
            connect(this._cardTitleColorInput, this._cardTitleColorPicker);
            connect(this._cardTextColorInput, this._cardTextColorPicker);
        }

        // --- Symbol List ---
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

        _populateSymbols() {
            const symbols = this._getSymbols();
            // Clear existing options
            this._iconSymbolSelect.innerHTML = '';
            
            symbols.forEach(symbol => {
                const option = document.createElement("option");
                option.value = symbol.value;
                option.textContent = symbol.label;
                this._iconSymbolSelect.appendChild(option);
            });
        }


        // --- Card Layout Configuration ---

        _addCardRowEntry(config = {}) {
            const entry = document.createElement("div");
            entry.className = "card-row-entry";

            const dataKeyInput = document.createElement("input");
            dataKeyInput.type = "text";
            dataKeyInput.className = "card-data-key full-width";
            dataKeyInput.placeholder = "Data Key (e.g., dimensions_0)";
            dataKeyInput.value = config.dataKey || '';

            const grid = document.createElement("div");
            grid.className = "card-row-grid";

            const labelInput = document.createElement("input");
            labelInput.type = "text";
            labelInput.className = "card-label";
            labelInput.placeholder = "Display Label";
            labelInput.value = config.label || '';

            const rowTypeSelect = document.createElement("select");
            rowTypeSelect.className = "card-row-type";
            // "Symbol" type removed
            ['Title', 'Text'].forEach(type => {
                const option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                if (type === config.type) option.selected = true;
                rowTypeSelect.appendChild(option);
            });
            
            const sortOrderInput = document.createElement("input");
            sortOrderInput.type = "number";
            sortOrderInput.className = "card-sort-order";
            sortOrderInput.placeholder = "Order";
            sortOrderInput.min = "1";
            sortOrderInput.value = config.order || (this._cardLayoutContainer.children.length + 1);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "✕ Remove";
            removeButton.addEventListener("click", () => {
                this._cardLayoutContainer.removeChild(entry);
                this._updateCardLayoutState();
            });

            entry.appendChild(dataKeyInput);
            grid.appendChild(labelInput);
            grid.appendChild(rowTypeSelect);
            grid.appendChild(sortOrderInput);
            entry.appendChild(grid);
            entry.appendChild(removeButton);
            
            this._cardLayoutContainer.appendChild(entry);
        }

        _updateCardLayoutState() {
            this._cardLayout = [];
            const entries = this._cardLayoutContainer.querySelectorAll(".card-row-entry");
            entries.forEach(entry => {
                const dataKey = entry.querySelector(".card-data-key").value;
                if (dataKey) {
                    this._cardLayout.push({
                        dataKey: dataKey,
                        label: entry.querySelector(".card-label").value,
                        type: entry.querySelector(".card-row-type").value,
                        order: parseInt(entry.querySelector(".card-sort-order").value, 10) || 0
                    });
                }
            });
            return this._cardLayout;
        }

        // --- Button Configuration ---
        
        _addButtonEntry(buttonId = '', tooltip = '', symbolType = 'info', visibility = 'visible', backgroundColor = '') {
            const entry = document.createElement("div");
            entry.className = "button-entry";
            
            const grid = document.createElement("div");
            grid.className = "button-grid";

            const buttonIdInput = document.createElement("input");
            buttonIdInput.type = "text";
            buttonIdInput.className = "button-id-input";
            buttonIdInput.placeholder = "Button ID (Required)";
            buttonIdInput.value = buttonId;
            
            const tooltipInput = document.createElement("input");
            tooltipInput.type = "text";
            tooltipInput.className = "button-tooltip-input";
            tooltipInput.placeholder = "Tooltip";
            tooltipInput.value = tooltip;

            const visibilitySelect = document.createElement("select");
            visibilitySelect.className = "button-visibility-select";
            ['visible', 'hidden'].forEach(val => {
                const option = document.createElement("option");
                option.value = val;
                option.textContent = val.charAt(0).toUpperCase() + val.slice(1);
                if(val === visibility) option.selected = true;
                visibilitySelect.appendChild(option);
            });
            
            const symbolSelect = document.createElement("select");
            symbolSelect.className = "button-symbol-select";
            // This select needs to be populated
            this._getSymbols().forEach(symbol => {
                const option = document.createElement("option");
                option.value = symbol.value;
                option.textContent = symbol.label;
                if (symbol.value === symbolType) option.selected = true;
                symbolSelect.appendChild(option);
            });


            const colorRow = document.createElement("div");
            colorRow.className = "color-row full-width";
            const colorInput = document.createElement("input");
            colorInput.type = "text";
            colorInput.className = "button-color-input color-input";
            colorInput.placeholder = "Background Color (Overrides default)";
            colorInput.value = backgroundColor || '';
            const colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.value = backgroundColor || '#FFFFFF';
            colorPicker.addEventListener("input", () => colorInput.value = colorPicker.value);
            colorInput.addEventListener("change", () => colorPicker.value = colorInput.value);
            colorRow.appendChild(colorInput);
            colorRow.appendChild(colorPicker);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "✕ Remove";
            removeButton.addEventListener("click", () => {
                this._buttonContainer.removeChild(entry);
                this._updateButtonsState();
            });
            
            grid.appendChild(buttonIdInput);
            grid.appendChild(tooltipInput);
            grid.appendChild(symbolSelect);
            grid.appendChild(visibilitySelect);
            entry.appendChild(grid);
            entry.appendChild(colorRow);
            entry.appendChild(removeButton);
            this._buttonContainer.appendChild(entry);
        }

        _updateButtonsState() {
            this._dynamicButtons = [];
            const entries = this._buttonContainer.querySelectorAll(".button-entry");
            entries.forEach(entry => {
                const buttonIdInput = entry.querySelector(".button-id-input");
                if (buttonIdInput.value) {
                    this._dynamicButtons.push({
                        id: buttonIdInput.value,
                        tooltip: entry.querySelector(".button-tooltip-input").value || '',
                        symbol: entry.querySelector(".button-symbol-select").value,
                        visibility: entry.querySelector(".button-visibility-select").value,
                        backgroundColor: entry.querySelector(".button-color-input").value || ''
                    });
                }
            });
            return this._dynamicButtons;
        }

        // --- Submit & Property Handlers ---

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        headerTitle: this.headerTitle,
                        cardIcon: this.cardIcon, // Add new property
                        cardBackgroundColor: this.cardBackgroundColor,
                        cardBorderColor: this.cardBorderColor,
                        cardTitleColor: this.cardTitleColor,
                        cardTextColor: this.cardTextColor,
                        cardsPerPage: this.cardsPerPage,
                        cardLayout: JSON.stringify(this._updateCardLayoutState()),
                        dynamicButtons: JSON.stringify(this._updateButtonsState())
                    }
                }
            }));
        }

        // --- Getters/Setters for Properties ---
        
        get headerTitle() { return this._headerTitleInput.value; }
        set headerTitle(value) { this._headerTitleInput.value = value || ''; }
        
        get cardIcon() {
            return JSON.stringify({
                symbol: this._iconSymbolSelect.value,
                color: this._iconColorInput.value
            });
        }
        set cardIcon(value) {
            try {
                const config = JSON.parse(value);
                this._iconSymbolSelect.value = config.symbol || 'folder';
                this._iconColorInput.value = config.color || '#1a73e8';
                this._iconColorPicker.value = config.color || '#1a73e8';
            } catch(e) {
                this._iconSymbolSelect.value = 'folder';
                this._iconColorInput.value = '#1a73e8';
                this._iconColorPicker.value = '#1a73e8';
            }
        }
        
        get cardBackgroundColor() { return this._cardBgColorInput.value; }
        set cardBackgroundColor(value) { this._cardBgColorInput.value = value; this._cardBgColorPicker.value = value; }
        
        get cardBorderColor() { return this._cardBorderColorInput.value; }
        set cardBorderColor(value) { this._cardBorderColorInput.value = value; this._cardBorderColorPicker.value = value; }
        
        get cardTitleColor() { return this._cardTitleColorInput.value; }
        set cardTitleColor(value) { this._cardTitleColorInput.value = value; this._cardTitleColorPicker.value = value; }
        
        get cardTextColor() { return this._cardTextColorInput.value; }
        set cardTextColor(value) { this._cardTextColorInput.value = value; this._cardTextColorPicker.value = value; }

        get cardsPerPage() { return parseInt(this._cardsPerPageInput.value, 10) || 10; }
        set cardsPerPage(value) { this._cardsPerPageInput.value = value || 10; }

        get cardLayout() { return JSON.stringify(this._updateCardLayoutState()); }
        set cardLayout(value) {
            try {
                this._cardLayoutContainer.innerHTML = '';
                const layout = JSON.parse(value);
                if (Array.isArray(layout) && layout.length > 0) {
                    layout.forEach(config => this._addCardRowEntry(config));
                } else {
                    this._addCardRowEntry();
                }
                this._cardLayout = layout;
            } catch (e) {
                this._addCardRowEntry();
            }
        }

        get dynamicButtons() { return JSON.stringify(this._updateButtonsState()); }
        set dynamicButtons(value) {
            try {
                this._buttonContainer.innerHTML = '';
                const buttons = JSON.parse(value);
                if (Array.isArray(buttons) && buttons.length > 0) {
                    buttons.forEach(button => this._addButtonEntry(
                        button.id, button.tooltip, button.symbol, button.visibility, button.backgroundColor
                    ));
                } else {
                    this._addButtonEntry();
                }
                this._dynamicButtons = buttons;
            } catch (e) {
                this._addButtonEntry();
            }
        }
    }

    customElements.define("com-example-simplecard-styling", StylePanel);
})();
