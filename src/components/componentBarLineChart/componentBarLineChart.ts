import { html, css, LitElement, type PropertyValues } from 'lit';
import { property, state, query } from 'lit/decorators.js';

export interface BarLineChartData {
  labels: string[];
  datasets: {
    label: string;
    type: 'bar' | 'line';
    data: (number | number[])[];
    color?: string;
    stackColors?: string[];
    stackLabels?: string[];
    yAxisID: 'y' | 'y1';
    dashed?: boolean;
    dotted?: boolean;
    hidden?: boolean;
  }[];
}

export default class ComponentBarLineChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 250px;
      font-family: 'Inter', sans-serif;
    }

    .chart-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 10px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--card-text, #333);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .legend-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-line {
      width: 20px;
      height: 2px;
    }

    .axis-label {
      font-size: 11px;
      fill: var(--card-text, #333);
      font-weight: bold;
    }

    .tick-text {
      font-size: 10px;
      fill: var(--palette-grey, #a19fa2);
    }

    .grid-line {
      stroke: var(--palette-lightgrey, #cdcdcd);
      stroke-width: 0.5;
      stroke-dasharray: 4,4;
    }

    .point {
      stroke-width: 2;
      fill: #fff;
    }
  `;

  @property({ type: Object }) chartData: BarLineChartData = {
    labels: [],
    datasets: []
  };

  @state() private _width: number = 0;
  @state() private _height: number = 0;
  @state() private _padding: { top: number, right: number, bottom: number, left: number } = {
    top: 40,
    right: 50,
    bottom: 40,
    left: 60
  };

  @query('.chart-container') private _chartContainer!: HTMLElement;

  firstUpdated() {
    this._updateDimensions();
    window.addEventListener('resize', () => this._updateDimensions());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', () => this._updateDimensions());
  }

  private _updateDimensions() {
    const rect = this.getBoundingClientRect();
    this._width = rect.width;
    this._height = rect.height;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('chartData') || changedProperties.has('_width') || changedProperties.has('_height')) {
      this._generateChartSvg();
    }
  }

  private _generateChartSvg() {
    if (!this._chartContainer || !this.chartData || this.chartData.labels.length === 0) return;
    this._chartContainer.innerHTML = '';

    const width = this._width || 300;
    const height = this._height || 250;
    const padding = this._padding;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    this._chartContainer.appendChild(svg);

    // Filter datasets by axis and visibility
    const yAxisDatasets = this.chartData.datasets.filter(ds => (ds.yAxisID === 'y' || !ds.yAxisID) && !ds.hidden);
    const y1AxisDatasets = this.chartData.datasets.filter(ds => ds.yAxisID === 'y1' && !ds.hidden);

    // Calculate ranges
    const getYRange = (datasets: any[], isLeft: boolean) => {
      let min = Infinity;
      let max = -Infinity;
      let hasBars = false;
      datasets.forEach(ds => {
        if (ds.type === 'bar') hasBars = true;
        ds.data.forEach((val: number | number[]) => {
          const sum = Array.isArray(val) ? val.reduce((a, b) => a + b, 0) : val;
          if (sum < min) min = sum;
          if (sum > max) max = sum;
        });
      });

      if (hasBars && min > 0) {
        min = 0;
      }

      if (min === Infinity) { min = 0; max = 10; }

      if (isLeft) {
        // Calories logic: nice steps
        const range = Math.max(1, max - min);
        const potentialSteps = [100, 200, 500, 1000, 2000];
        let step = 500;
        for (const s of potentialSteps) {
          step = s;
          if (range / s <= 6) break;
        }
        const yAxisMin = Math.floor(min / step) * step;
        let yAxisMax = yAxisMin;
        while (yAxisMax < max || (yAxisMax - yAxisMin) / step < 4) {
          yAxisMax += step;
        }
        return { min: yAxisMin, max: yAxisMax, range: yAxisMax - yAxisMin, step };
      } else {
        // Levels/Hours logic (right axis)
        const rangeMax = Math.max(10, max); // At least 0-10
        const yAxisMax = Math.ceil(rangeMax);
        return { min: 0, max: yAxisMax, range: yAxisMax, step: 1 };
      }
    };

    const yRange = getYRange(yAxisDatasets, true);
    const y1Range = getYRange(y1AxisDatasets, false);

    const availableWidth = width - padding.left - padding.right;
    const availableHeight = height - padding.top - padding.bottom;
    const stepX = availableWidth / (this.chartData.labels.length || 1);

    // Draw Axes Ticks and Grid
    const numTicksY = (yRange.range / yRange.step) + 1;
    for (let i = 0; i < numTicksY; i++) {
      const valY = yRange.min + (i * yRange.step);
      const ratio = (valY - yRange.min) / yRange.range;
      const y = height - padding.bottom - (ratio * availableHeight);

      // Grid line
      const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      grid.setAttribute('x1', padding.left.toString());
      grid.setAttribute('y1', y.toString());
      grid.setAttribute('x2', (width - padding.right).toString());
      grid.setAttribute('y2', y.toString());
      grid.setAttribute('class', 'grid-line');
      svg.appendChild(grid);

      // Left axis ticks (Calories)
      const textY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textY.setAttribute('x', (padding.left - 10).toString());
      textY.setAttribute('y', y.toString());
      textY.setAttribute('text-anchor', 'end');
      textY.setAttribute('alignment-baseline', 'middle');
      textY.setAttribute('class', 'tick-text');
      textY.textContent = valY.toString();
      svg.appendChild(textY);
    }

    // Right axis ticks (Levels/Hours)
    for (let i = 0; i <= y1Range.max; i += y1Range.step) {
      const ratio = i / y1Range.max;
      const y = height - padding.bottom - (ratio * availableHeight);

      const textY1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textY1.setAttribute('x', (width - padding.right + 10).toString());
      textY1.setAttribute('y', y.toString());
      textY1.setAttribute('text-anchor', 'start');
      textY1.setAttribute('alignment-baseline', 'middle');
      textY1.setAttribute('class', 'tick-text');
      textY1.textContent = i.toString();
      svg.appendChild(textY1);
    }

    // Axis Labels
    const leftLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    leftLabel.setAttribute('x', '15');
    leftLabel.setAttribute('y', (height / 2).toString());
    leftLabel.setAttribute('transform', `rotate(-90, 15, ${height / 2})`);
    leftLabel.setAttribute('text-anchor', 'middle');
    leftLabel.setAttribute('class', 'axis-label');
    leftLabel.textContent = 'Calorías (kcal)';
    svg.appendChild(leftLabel);

    const rightLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    rightLabel.setAttribute('x', (width - 15).toString());
    rightLabel.setAttribute('y', (height / 2).toString());
    rightLabel.setAttribute('transform', `rotate(90, ${width - 15}, ${height / 2})`);
    rightLabel.setAttribute('text-anchor', 'middle');
    rightLabel.setAttribute('class', 'axis-label');
    rightLabel.textContent = `Nivel / Horas (0-${y1Range.max})`;
    svg.appendChild(rightLabel);

    // Draw Bars
    const barDatasets = this.chartData.datasets.filter(d => d.type === 'bar');
    const totalBars = barDatasets.length;
    const groupPadding = stepX * 0.2;
    const groupWidth = stepX - groupPadding;
    const individualBarWidth = groupWidth / totalBars;

    this.chartData.labels.forEach((label, i) => {
      // X label
      const xText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xText.setAttribute('x', (padding.left + (i + 0.5) * stepX).toString());
      xText.setAttribute('y', (height - padding.bottom + 20).toString());
      xText.setAttribute('text-anchor', 'middle');
      xText.setAttribute('class', 'tick-text');
      xText.textContent = label;
      svg.appendChild(xText);

      // Bars
      barDatasets.forEach((ds, dsIndex) => {
        const val = ds.data[i] || 0;
        const x = padding.left + (i * stepX) + (groupPadding / 2) + (dsIndex * individualBarWidth);
        const width = individualBarWidth * 0.85;

        if (Array.isArray(val)) {
          let currentYValue = 0;
          val.forEach((stackVal, stackIndex) => {
            const vBottom = currentYValue;
            const vTop = currentYValue + stackVal;

            // Map values to Y coordinates
            const yTop = height - padding.bottom - ((vTop - yRange.min) / yRange.range) * availableHeight;
            const yBottom = height - padding.bottom - ((vBottom - yRange.min) / yRange.range) * availableHeight;

            // Clip to visible area (bottom axis)
            const clippedYBottom = Math.min(yBottom, height - padding.bottom);
            const clippedYTop = Math.max(yTop, padding.top);

            const rectHeight = clippedYBottom - clippedYTop;

            if (rectHeight > 0) {
              const defaultStackColors = ['var(--carbs-color)', 'var(--fat-color)', 'var(--fat-color)', 'var(--palette-grey)'];
              const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              rect.setAttribute('x', x.toString());
              rect.setAttribute('y', clippedYTop.toString());
              rect.setAttribute('width', width.toString());
              rect.setAttribute('height', rectHeight.toString());

              let fillColor: string = ds.color || 'var(--palette-blue)';
              if (ds.stackColors && ds.stackColors[stackIndex]) {
                fillColor = ds.stackColors[stackIndex];
              } else if (!ds.stackColors) {
                fillColor = defaultStackColors[stackIndex % defaultStackColors.length];
              }

              rect.setAttribute('fill', fillColor);
              rect.setAttribute('rx', '2');
              svg.appendChild(rect);
            }
            currentYValue += stackVal;
          });
        } else {
          const barHeight = ((val - yRange.min) / yRange.range) * availableHeight;
          const y = height - padding.bottom - barHeight;

          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x.toString());
          rect.setAttribute('y', y.toString());
          rect.setAttribute('width', width.toString());
          rect.setAttribute('height', Math.max(0, barHeight).toString());
          rect.setAttribute('fill', ds.color || (ds.yAxisID === 'y' ? 'var(--calories-color)' : 'var(--palette-blue)'));
          rect.setAttribute('rx', '2');
          svg.appendChild(rect);
        }
      });
    });

    // Draw Lines
    const lineDatasets = this.chartData.datasets.filter(d => d.type === 'line');
    lineDatasets.forEach(ds => {
      const points = ds.data.map((val, i) => {
        const x = padding.left + (i + 0.5) * stepX;
        const range = ds.yAxisID === 'y' ? yRange : y1Range;
        const numericVal = Array.isArray(val) ? val.reduce((a, b) => a + b, 0) : val;
        const y = height - padding.bottom - (((numericVal - range.min) / range.range) * availableHeight);
        return { x, y };
      });

      if (points.length < 1) return;

      if (points.length === 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', points[0].x.toString());
        circle.setAttribute('cy', points[0].y.toString());
        circle.setAttribute('r', '4');
        const defaultLineColor = (ds.dashed || ds.dotted) ? 'var(--satiety-color)' : 'var(--energy-color)';
        circle.setAttribute('stroke', ds.color || defaultLineColor);
        circle.setAttribute('class', 'point');
        svg.appendChild(circle);
        return;
      }

      // Draw Path
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 3;
        const cp2x = curr.x + 2 * (next.x - curr.x) / 3;
        d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      const defaultLineColor = (ds.dashed || ds.dotted) ? 'var(--satiety-color)' : 'var(--energy-color)';
      path.setAttribute('stroke', ds.color || defaultLineColor);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      if (ds.dashed) path.setAttribute('stroke-dasharray', '5,5');
      if (ds.dotted) path.setAttribute('stroke-dasharray', '2,4');
      svg.appendChild(path);

      // Draw Points
      points.forEach(p => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', p.x.toString());
        circle.setAttribute('cy', p.y.toString());
        circle.setAttribute('r', '4');
        const defaultLineColor = (ds.dashed || ds.dotted) ? 'var(--satiety-color)' : 'var(--energy-color)';
        circle.setAttribute('stroke', ds.color || defaultLineColor);
        circle.setAttribute('class', 'point');
        svg.appendChild(circle);
      });
    });
  }

  render() {
    return html`
      <div class="legend">
        ${this.chartData.datasets.map(ds => {
      // Determine if the dataset uses the 'y' axis (Calories)
      const isCalories = ds.yAxisID === 'y';

      if (ds.type === 'bar' && ds.stackLabels) {
        // Render stacked bar legend items
        const stackItems = ds.stackLabels.map((label, idx) => {
          let fillColor = ds.color || 'var(--palette-green)';
          if (ds.stackColors && ds.stackColors[idx]) {
            fillColor = ds.stackColors[idx];
          } else if (!ds.stackColors) {
            const defaultStackColors = ['var(--carbs-color)', 'var(--fat-color)', 'var(--fat-color)', 'var(--palette-grey)'];
            fillColor = defaultStackColors[idx % defaultStackColors.length];
          }

          // If label starts with "Total", use a specific style (transparent box with border)
          const isTotal = label.toLowerCase().includes('total');
          const boxStyle = isTotal
            ? 'border: 1px solid var(--palette-grey); background: transparent;'
            : `background: ${fillColor}`;

          return html`
            <div class="legend-item">
              <div class="legend-box" style="${boxStyle}"></div>
              <span class="${isTotal ? 'total-label' : ''}">${label}</span>
            </div>
          `;
        });
        return stackItems; // Return the array of stack items
      }

      // Render non-stacked bar or line legend items
      let defaultColor = ds.type === 'bar' ? (isCalories ? 'var(--calories-color)' : 'var(--palette-blue)') : 'var(--energy-color)';
      if (ds.type === 'line' && (ds.dashed || ds.dotted)) {
        defaultColor = 'var(--satiety-color)';
      }
      const dsColor = ds.color || defaultColor;

      return html`
        <div class="legend-item">
          ${ds.type === 'bar'
          ? html`<div class="legend-box" style="background: ${dsColor}"></div>`
          : html`<div class="legend-line" style="border-top: 2px ${ds.dotted ? 'dotted' : ds.dashed ? 'dashed' : 'solid'} ${dsColor}"></div>`}
          <span>${ds.label}</span>
        </div>
      `;
    })}
      </div>
      <div class="chart-container"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-bar-line-chart': ComponentBarLineChart;
  }
}
