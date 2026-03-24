import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { variableStyles } from '../../shared/functions';
import '../componentEmoji/componentEmoji';

@customElement('component-slider')
export default class ComponentSlider extends LitElement {
  static styles = [
    variableStyles,
    css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--font-family, system-ui, sans-serif);
      position: relative;
    }

    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }

    .labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--text-color, inherit);
      font-weight: 500;
    }

    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      background: var(--palette-lightgrey, #e0e0e0);
      border-radius: 3px;
      outline: none;
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    /* Light mode specific adjustment for "white background" */
    :host(:not([data-theme="dark"])) input[type="range"] {
      background: #f0f0f0;
      border: 1px solid #e0e0e0;
    }

    input[type="range"]:hover {
      opacity: 1;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--palette-green, #4fb9ad);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.1s;
    }

    input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--palette-green, #4fb9ad);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.1s;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }
    
    :host([data-theme="dark"]) input[type="range"] {
       background: rgba(255, 255, 255, 0.1);
    }
    :host([data-theme="dark"]) input[type="range"]::-webkit-slider-thumb {
       background: var(--palette-purple, #a285bb);
    }
    :host([data-theme="dark"]) input[type="range"]::-moz-range-thumb {
       background: var(--palette-purple, #a285bb);
    }

    .tooltip {
      position: absolute;
      top: -30px;
      left: 0;
      transform: translateX(-50%);
      background-color: var(--card-background, #fff);
      color: var(--text-color, #191c25);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid var(--card-border, #4fb9ad);
    }
    
    .tooltip.visible {
      opacity: 1;
    }
  `];

  @property({ type: String }) format: 'number' | 'time' = 'number';

  @property({ type: Number }) steps = 1;
  @property({ type: String }) minTag = '';
  @property({ type: String }) maxTag = '';
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) value = 50;
  @property({ type: Boolean }) emoji = false;

  @state() private isDragging = false;
  @state() private tooltipPosition = 0;

  private updateTooltipPosition(target: HTMLInputElement) {
    const min = Number(target.min) || 0;
    const max = Number(target.max) || 100;
    const val = Number(target.value);

    const percent = (val - min) / (max - min);

    const thumbWidth = 20;

    const offset = ((thumbWidth / 2) - (thumbWidth * percent)) + 3;
    this.tooltipPosition = `calc(${percent * 100}% + ${offset}px)` as any;
  }

  private formatValue(val: number): string {
    if (this.format === 'time') {
      const hours = Math.floor(val);
      const minutes = Math.round((val - hours) * 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return String(val);
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.updateTooltipPosition(target);

    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private handlePointerDown(e: Event) {
    this.isDragging = true;
    this.updateTooltipPosition(e.target as HTMLInputElement);
  }

  private handlePointerUp() {
    this.isDragging = false;
  }

  private get currentTheme() {
    return this.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') || 'light';
  }

  render() {
    const theme = this.currentTheme;
    return html`
      <div class="slider-container" data-theme="${theme}">
        <div class="tooltip ${this.isDragging ? 'visible' : ''}" style="left: ${this.tooltipPosition}">
          ${this.formatValue(this.value)}
        </div>
        <input 
          type="range" 
          min="${this.min}" 
          max="${this.max}" 
          step="${this.steps}" 
          .value="${String(this.value)}"
          @input="${this.handleInput}"
          @mousedown="${this.handlePointerDown}"
          @mouseup="${this.handlePointerUp}"
          @touchstart="${this.handlePointerDown}"
          @touchend="${this.handlePointerUp}"
          aria-label="Slider"
        />
        ${this.minTag || this.maxTag ? html`
          <div class="labels">
            <span>${this.emoji ? html`<component-emoji text="${this.minTag}" size="m"></component-emoji>` : this.minTag}</span>
            <span>${this.emoji ? html`<component-emoji text="${this.maxTag}" size="m"></component-emoji>` : this.maxTag}</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}
