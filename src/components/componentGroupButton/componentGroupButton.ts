import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface GroupButtonOption {
  text: string;
  id: string;
  active: boolean;
  emoji?: boolean;
}

export class ComponentGroupButton extends LitElement {
  @property({ type: Array }) set options(value: GroupButtonOption[] | string) {
    this.optionsState = typeof value === 'string' ? JSON.parse(value) : value;
  }

  @state() optionsState: GroupButtonOption[] = [];

  @property({ type: String }) size: 'xs' | 's' | 'm' | 'l' | 'xl' = 'xs';

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .group-button-container {
      display: flex;
      flex-direction: row;
      border-radius: 40px;
      overflow: hidden;
      width: fit-content;
      background-color: var(--unselected-group-button-color, #fff);
    }

    .group-button {
      background: transparent;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease, color 0.3s ease;
      color: var(--input-text, #000);
      flex: 1;
      border-radius: 40px;
    }

    .group-button:last-child {
      border-right: none;
    }

    .group-button.active {
      background-color: var(--selected-group-button-color, var(--palette-green));
      color: var(--group-button-active-text, #fff);
    }

    .size-xs .group-button {
      padding: 8px 16px;
      font-size: 0.875rem;
    }

    .size-s .group-button {
      padding: 10px 20px;
      font-size: 1rem;
    }

    .size-m .group-button {
      padding: 12px 24px;
      font-size: 1.125rem;
    }

    .size-l .group-button {
      padding: 14px 28px;
      font-size: 1.25rem;
    }

    .size-xl .group-button {
      padding: 16px 32px;
      font-size: 1.375rem;
    }
  `;

  render() {
    return html`
      <div class="group-button-container size-${this.size}" role="group">
        ${this.optionsState.map(option => html`
          <button
            class="group-button ${option.active ? 'active' : ''}"
            @click="${() => this._handleClick(option.id)}"
            type="button"
          >
            ${option.emoji ? html`<component-emoji text="${option.text}"></component-emoji>` : option.text}
          </button>
        `)}
      </div>
    `;
  }

  private _handleClick(id: string) {
    this.dispatchEvent(new CustomEvent('group-button-click', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-group-button': ComponentGroupButton;
  }
}
