import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('component-slider')
export default class ComponentSlider extends LitElement {
  static styles = css`
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
      height: 8px;
      background: var(--background-secondary, #e0e0e0);
      border-radius: 4px;
      outline: none;
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    input[type="range"]:hover {
      opacity: 1;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--palette-green, #4CAF50);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform 0.1s;
    }

    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--palette-green, #4CAF50);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform 0.1s;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }

    /* Support for dark mode styling directly */
    @media (prefers-color-scheme: dark) {
      input[type="range"] {
         background: var(--background-secondary-dark, #424242);
      }
      input[type="range"]::-webkit-slider-thumb {
         background: var(--palette-purple, #9c27b0);
      }
      input[type="range"]::-moz-range-thumb {
         background: var(--palette-purple, #9c27b0);
      }
    }
    
    /* Global class based dark mode support in open-cal */
    :host([data-theme="dark"]) input[type="range"] {
       background: var(--background-secondary-dark, #424242);
    }
    :host([data-theme="dark"]) input[type="range"]::-webkit-slider-thumb {
       background: var(--palette-purple, #9c27b0);
    }
    :host([data-theme="dark"]) input[type="range"]::-moz-range-thumb {
       background: var(--palette-purple, #9c27b0);
    }

    .tooltip {
      position: absolute;
      top: -30px;
      left: 0;
      transform: translateX(-50%);
      background-color: var(--card-background, #333);
      color: var(--text-color, #fff);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .tooltip.visible {
      opacity: 1;
    }
  `;

  @property({ type: Number }) steps = 1;
  @property({ type: String }) minTag = '';
  @property({ type: String }) maxTag = '';
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) value = 50;

  @state() private isDragging = false;
  @state() private tooltipPosition = 0;

  private updateTooltipPosition(target: HTMLInputElement) {
    // Calculate the thumb position percentage
    const min = Number(target.min) || 0;
    const max = Number(target.max) || 100;
    const val = Number(target.value);

    // percentage between 0 to 1
    const percent = (val - min) / (max - min);

    // Width of standard slider thumb is approx 20px
    const thumbWidth = 20;

    // Position offset taking into account the thumb width
    const offset = (thumbWidth / 2) - (thumbWidth * percent);
    this.tooltipPosition = `calc(\${percent * 100}% + \${offset}px)` as any;
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.updateTooltipPosition(target);

    // Dispatch custom event for consumers
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

  render() {
    return html`
      <div class="slider-container">
        <div class="tooltip ${this.isDragging ? 'visible' : ''}" style="left: ${this.tooltipPosition}">
          ${this.value}
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
            <span>${this.minTag}</span>
            <span>${this.maxTag}</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}
