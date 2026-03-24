import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface SearchInputComponentInterface {
  value?: string;
  placeholder?: string;
  'search-init'?: (query: { data: { query: string } }) => void;
}

export class ComponentSearchInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @state() previousValue = '';

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .input-container {
      display: flex;
      align-items: center;
      border: 1px solid var(--input-border, var(--palette-grey));
      border-radius: 25px;
      padding: 5px 5px 5px 20px;
      background: var(--card-background, white);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .input-container:focus-within {
      border-color: var(--palette-purple);
      box-shadow: 0 0 5px rgba(162, 133, 187, 0.3);
    }
    input {
      font-size: 1rem;
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--input-text, var(--palette-black));
      padding: 5px 0;
    }
    input::placeholder {
      color: var(--input-placeholder, #757575);
    }
    button {
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      background-color: var(--group-button-active-bg, var(--palette-green));
      color: var(--group-button-active-text, #fff);
      border: none;
      border-radius: 50%;
      transition: transform 0.2s ease, background-color 0.3s ease;
      margin-left: 10px;
    }
    button:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
    button:active {
      transform: scale(0.95);
    }
  `;

  render() {
    return html`
      <div class="input-container">
        <input 
          type="text" 
          .value="${this.value}" 
          @input="${this._handleInput}" 
          @blur="${this._handleBlur}" 
          @keydown="${this._handleKeyDown}"
          placeholder="${this.placeholder}"
          aria-label="Search"
        />
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
  }

  private _handleBlur() {
    this.dispatchEvent(new CustomEvent('search-blur', {
      detail: { query: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _handleSearchClick() {
    this.dispatchEvent(new CustomEvent('search-init', {
      detail: { query: this.value, isButtonClick: true },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('search-init', {
        detail: { query: this.value, isButtonClick: false },
        bubbles: true,
        composed: true
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-search-input': ComponentSearchInput;
  }
}
