import { html, css, LitElement, type PropertyValues } from 'lit';
import { property, state, query } from 'lit/decorators.js';

export default class ComponentLineChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 200px;
      font-family: sans-serif;
    }

    .chart-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .line {
      fill: none;
      stroke: var(--chart-line-color, var(--palette-green, #4caf50));
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .axis {
      stroke: var(--chart-axis-color, var(--palette-grey, #ccc));
      stroke-width: 1;
    }

    .tooltip {
      position: absolute;
      background: var(--card-background, #fff);
      border: 1px solid var(--card-border, #ccc);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      color: var(--card-text, #333);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transform: translate(-50%, -100%);
      margin-top: -10px;
    }

    .point {
      fill: var(--chart-line-color, #fff);
      stroke: var(--chart-line-color, var(--palette-green, #4caf50));
      stroke-width: 2;
      cursor: pointer;
      transition: r 0.2s;
    }

    .point:hover {
      r: 6;
    }
  `;

  @property({ type: Array }) data: { tag: string, value: number }[] = [];

  @state() private _hoveredText: string | null = null;
  @state() private _hoveredX: number = 0;
  @state() private _hoveredY: number = 0;
  @state() private _width: number = 0;
  @state() private _height: number = 0;
  @state() private _padding: number = 40;


  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }

  firstUpdated() {
    this._updateDimensions();
  }

  private _updateDimensions() {
    const rect = this.getBoundingClientRect();
    this._width = rect.width || this.offsetWidth;
    this._height = rect.height || this.offsetHeight;
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  @query('.chart-container') private _chartContainer!: HTMLElement;

  updated(changedProperties: PropertyValues) {

    if (changedProperties.has('data') || changedProperties.has('_width') || changedProperties.has('_height')) {
      this._generateChartSvg();
    }
  }

  private _handleMouseEnter(tag: string, val: number, x: number, y: number) {
    this._hoveredText = `${tag}(${val})`;
    this._hoveredX = x;
    this._hoveredY = y;
  }

  private _handleMouseLeave() {
    this._hoveredText = null;
  }

  private _generateChartSvg() {
    if (!this._chartContainer) return;

    this._chartContainer.innerHTML = '';

    const width = this._width || this.offsetWidth || 300;
    const height = this._height || this.offsetHeight || 200;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.overflow = 'visible';

    this._chartContainer.appendChild(svg);

    if (!this.data || this.data.length === 0) return;

    const safeData = this.data.map(item => ({ tag: item.tag, value: Number(item.value) }));
    const rawMin = Math.min(...safeData.map(d => d.value));
    const rawMax = Math.max(...safeData.map(d => d.value));

    // Determine an integer step size (1, 2, 5, 10, ...)
    const range = Math.ceil(rawMax) - Math.floor(rawMin);
    const potentialSteps = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    let step = 1;
    for (const s of potentialSteps) {
      step = s;
      if (range / s <= 6) break; // Aim for up to 7 labels (6 intervals)
    }

    let yAxisMin = Math.floor(rawMin / step) * step;
    let yAxisMax = yAxisMin;
    while (yAxisMax < rawMax || (yAxisMax - yAxisMin) / step < 2) {
      yAxisMax += step;
    }

    const valRange = yAxisMax - yAxisMin;
    const numLabels = Math.round(valRange / step) + 1;

    const availableWidth = width - (this._padding * 2);
    const availableHeight = height - (this._padding * 2);
    const stepX = availableWidth / (Math.max(safeData.length - 1, 1));

    // X-Axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', this._padding.toString());
    xAxis.setAttribute('y1', (height - this._padding).toString());
    xAxis.setAttribute('x2', (width - this._padding).toString());
    xAxis.setAttribute('y2', (height - this._padding).toString());
    xAxis.setAttribute('class', 'axis');
    svg.appendChild(xAxis);

    // Y-Axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', (width - this._padding).toString());
    yAxis.setAttribute('y1', this._padding.toString());
    yAxis.setAttribute('x2', (width - this._padding).toString());
    yAxis.setAttribute('y2', (height - this._padding).toString());
    yAxis.setAttribute('class', 'axis');
    svg.appendChild(yAxis);

    // Y-Axis Labels & Grid lines
    for (let i = 0; i < numLabels; i++) {
      const val = yAxisMax - (i * step);
      const y = this._padding + (i * ((height - (this._padding * 2)) / (numLabels - 1)));

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (width - this._padding + 8).toString());
      text.setAttribute('y', y.toString());
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-size', '11px');
      text.setAttribute('fill', 'var(--card-text, #333)');
      text.textContent = val.toString();
      svg.appendChild(text);

      // Horizontal grid lines
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', this._padding.toString());
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', (width - this._padding).toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', 'var(--chart-axis-color, var(--palette-grey, #ccc))');
      gridLine.setAttribute('stroke-width', '0.5');
      gridLine.setAttribute('stroke-dasharray', '4,4');
      svg.appendChild(gridLine);
    }

    // X-Axis Labels
    if (safeData.length > 0) {
      // First label
      const firstText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      firstText.setAttribute('x', this._padding.toString());
      firstText.setAttribute('y', (height - this._padding + 15).toString());
      firstText.setAttribute('text-anchor', 'start');
      firstText.setAttribute('font-size', '11px');
      firstText.setAttribute('fill', 'var(--card-text, #333)');
      firstText.textContent = safeData[0].tag;
      svg.appendChild(firstText);

      // Last label
      if (safeData.length > 1) {
        const lastText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lastText.setAttribute('x', (width - this._padding).toString());
        lastText.setAttribute('y', (height - this._padding + 15).toString());
        lastText.setAttribute('text-anchor', 'end');
        lastText.setAttribute('font-size', '11px');
        lastText.setAttribute('fill', 'var(--card-text, #333)');
        lastText.textContent = safeData[safeData.length - 1].tag;
        svg.appendChild(lastText);
      }
    }

    // Smooth Path
    const coords = safeData.map((item, index) => {
      const x = this._padding + (index * stepX);
      const y = height - this._padding - (((item.value - yAxisMin) / valRange) * availableHeight);
      return { x, y };
    });

    let pathData = '';
    if (coords.length > 0) {
      pathData += `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const current = coords[i];
        const next = coords[i + 1];
        const midX = (current.x + next.x) / 2;
        pathData += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
      }
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'line');

    svg.appendChild(path);

    // Circles
    safeData.forEach((item, index) => {
      const x = this._padding + (index * stepX);
      const y = height - this._padding - (((item.value - yAxisMin) / valRange) * availableHeight);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '1.5');
      circle.setAttribute('class', 'point');

      // Event listeners for tooltip
      circle.addEventListener('mouseenter', () => this._handleMouseEnter(item.tag, item.value, x, y));
      circle.addEventListener('mouseleave', () => this._handleMouseLeave());

      svg.appendChild(circle);
    });

  }

  render() {
    return html`
        <div style="position: relative; width: 100%; height: 100%;">
            <div class="chart-container"></div>
            ${this._hoveredText !== null ? html`
                <div class="tooltip" style="left: ${this._hoveredX}px; top: ${this._hoveredY}px; opacity: 1;">
                    ${this._hoveredText}
                </div>
            ` : ''}
        </div>
      `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-line-chart': ComponentLineChart;
  }
}
