import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export type ComponentProgressBarProps = {
  dailyCaloriesGoal: number;
  caloriesEaten: number;
  fatEaten: number;
  carbsEaten: number;
  proteinEaten: number;
  fatGoalPercent?: number;
  carbsGoalPercent?: number;
  proteinGoalPercent?: number;
  fatEatenPercent?: number;
  carbsEatenPercent?: number;
  proteinEatenPercent?: number;
}

export class ComponentProgressBar extends LitElement {
  @property({ type: Number }) dailyCaloriesGoal = 0;
  @property({ type: Number }) caloriesEaten = 0;
  @property({ type: Number }) fatEaten = 0;
  @property({ type: Number }) carbsEaten = 0;
  @property({ type: Number }) proteinEaten = 0;

  @property({ type: Number }) fatGoalPercent = 0;
  @property({ type: Number }) carbsGoalPercent = 0;
  @property({ type: Number }) proteinGoalPercent = 0;

  @property({ type: Number }) fatEatenPercent = -1;
  @property({ type: Number }) carbsEatenPercent = -1;
  @property({ type: Number }) proteinEatenPercent = -1;

  @property({ type: String }) set translations(translations: string) {
    this.translationsTexts = JSON.parse(translations);
  };

  @state() translationsTexts: { [key: string]: string } = {};

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--font-family, sans-serif);
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .progress-bar-text {
        font-size: 0.9rem;
        color: var(--text-color, #333);
        margin-bottom: 4px;
        font-weight: 500;
    }

    .progress-bar-track {
      width: 100%;
      height: 12px;
      background-color: var(--input-background, #e0e0e0);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      overflow: hidden;
      display: flex;
    }

    .segment {
      height: 100%;
      transition: width 0.3s ease;
    }

    .segment.fat {
      background-color: var(--fat-color, #f1c40f);
    }

    .segment.carbs {
      background-color: var(--carbs-color, #3498db);
    }

    .segment.protein {
      background-color: var(--protein-color, #e74c3c);
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    .label-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .label {
      text-align: right;
      font-size: 0.9rem;
      color: var(--text-color, #333);
      font-weight: 500;
      white-space: nowrap;
    }
    
    .label span {
        font-weight: bold;
    }

    .label.fat {
        color: var(--fat-color, #f1c40f);
    }

    .label.carbs {
        color: var(--carbs-color, #3498db);
    }

    .label.protein {
        color: var(--protein-color, #e74c3c);
    }

    .macros-label {
        display: flex;
        gap: 15px;
        font-size: 0.85rem;
        color: var(--text-color, #666);
    }
    
    .macros-label span {
        font-weight: bold;
    }
  `;

  render() {
    const fatCalories = this.fatEaten * 9;
    const carbsCalories = this.carbsEaten * 4;
    const proteinCalories = this.proteinEaten * 4;
    const remaining = this.dailyCaloriesGoal - this.caloriesEaten;
    const totalGoal = this.dailyCaloriesGoal > 0 ? this.dailyCaloriesGoal : 1;

    let currentFatPercent = this.fatEatenPercent;
    let currentCarbsPercent = this.carbsEatenPercent;
    let currentProteinPercent = this.proteinEatenPercent;

    if (currentFatPercent === -1 || currentCarbsPercent === -1 || currentProteinPercent === -1) {
      const macroTotal = (fatCalories + carbsCalories + proteinCalories) || 1;
      currentFatPercent = (fatCalories / macroTotal) * 100;
      currentCarbsPercent = (carbsCalories / macroTotal) * 100;
      currentProteinPercent = (proteinCalories / macroTotal) * 100;

      if ((fatCalories + carbsCalories + proteinCalories) === 0) {
        currentFatPercent = 0;
        currentCarbsPercent = 0;
        currentProteinPercent = 0;
      }
    }

    const totalEatenPercent = currentFatPercent + currentCarbsPercent + currentProteinPercent;
    const usagePercent = Math.min((this.caloriesEaten / totalGoal) * 100, 100);

    let renderedFatWidth = 0;
    let renderedCarbsWidth = 0;
    let renderedProteinWidth = 0;

    if (totalEatenPercent > 0) {
      renderedFatWidth = (currentFatPercent / totalEatenPercent) * usagePercent;
      renderedCarbsWidth = (currentCarbsPercent / totalEatenPercent) * usagePercent;
      renderedProteinWidth = (currentProteinPercent / totalEatenPercent) * usagePercent;
    }

    let statusText = '';
    if (this.caloriesEaten <= this.dailyCaloriesGoal) {
      statusText = this.translationsTexts['remainingCals']?.replace('{cal}', remaining.toString());
    } else {
      statusText = this.translationsTexts['remainingCalsOver']?.replace('{cal}', Math.abs(remaining).toString());
    }

    return html`
      <div class="container">
        <div class="progress-bar-text">
            ${statusText}
        </div>
        <div class="progress-bar-track" role="progressbar" aria-valuenow="${this.caloriesEaten}" aria-valuemin="0" aria-valuemax="${this.dailyCaloriesGoal}" aria-label="Daily calories progress">
           <div class="segment carbs" style="width: ${renderedCarbsWidth}%" title="Carbs: ${this.carbsEaten}g"></div>
           <div class="segment fat" style="width: ${renderedFatWidth}%" title="Fat: ${this.fatEaten}g"></div>
           <div class="segment protein" style="width: ${renderedProteinWidth}%" title="Protein: ${this.proteinEaten}g"></div>
        </div>
        <div class="label-container">
          <div class="macros-label">
            <div><span class="label carbs">${this.translationsTexts['carbs']}</span> <span>${Math.round(currentCarbsPercent)}</span> / ${this.carbsGoalPercent}%</div>
            <div><span class="label fat">${this.translationsTexts['fat']}</span> <span>${Math.round(currentFatPercent)}</span> / ${this.fatGoalPercent}%</div>
            <div><span class="label protein">${this.translationsTexts['protein']}</span> <span>${Math.round(currentProteinPercent)}</span> / ${this.proteinGoalPercent}%</div>
          </div>
          <div class="label">
             <span>${this.caloriesEaten}</span> / ${this.dailyCaloriesGoal} ${this.translationsTexts['kcalEated']}
          </div>
        </div>
      </div>
    `;
  }
}
