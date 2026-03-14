import { property, state, customElement } from 'lit/decorators.js';
import { type PropertyValues, LitElement, html, css } from 'lit';
import Page from '../../shared/page';

@customElement('component-maintenance-calories')
export default class ComponentMaintenanceCalories extends LitElement {
  @property({ type: Number }) height = 0;
  @property({ type: Number }) weight = 0;
  @property({ type: String }) gender = '';
  @property({ type: Number }) age = 30;
  @property({ type: Boolean }) showWarning = true;
  @property({ type: String }) set translations(translations: string) {
    if (translations) {
      this.translationsTexts = JSON.parse(translations);
    }
  };

  @state() private _height = 0;
  @state() private _weight = 0;
  @state() private _gender = '';
  @state() private _age = 30;
  @state() private activityLevel = 1.2;
  @state() private dietType = 'balanced';
  @state() private proteinRatio = 20;
  @state() private carbsRatio = 50;
  @state() private fatRatio = 30;
  @state() private translationsTexts: { [key: string]: string } = {};

  static styles = [
    Page.styles,
    css`
    :host {
      display: block;
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
    }

    .form-container {
      background: var(--card-background, #fff);
      border: 1px solid var(--card-border, #4fb9ad);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      margin-bottom: 4px;
    }

    .header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--primary-color, #4fb9ad);
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
      margin-top: 4px;
    }

    .subtitle a {
      color: var(--primary-color, #4fb9ad);
      text-decoration: underline;
      font-weight: 500;
    }

    .save-button {
      margin-top: 16px;
      padding: 12px;
      background-color: var(--group-button-active-bg, var(--palette-green, #4fb9ad));
      color: var(--group-button-active-text, #fff);
      border: none;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s, transform 0.1s ease;
      width: 100%;
      font-size: 1rem;
    }

    .save-button:hover {
      opacity: 0.9;
    }

    .save-button:active {
      transform: scale(0.98);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: bold;
      font-size: 0.9rem;
      color: var(--text-color, #191c25);
    }

    input, select {
      padding: 10px;
      border: 1px solid var(--card-border, #4fb9ad);
      border-radius: 8px;
      background: var(--input-background, #fff);
      color: var(--text-color);
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
    }

    .result-container {
      margin-top: 10px;
      padding: 16px;
      background: var(--primary-color-light, #e0f2f1);
      border-radius: 8px;
      text-align: center;
    }

    .result-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color, #4fb9ad);
    }

    .result-label {
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
    }

    .warning-message {
      margin-top: 16px;
      padding: 12px;
      background: var(--warning-background, #fff3e0);
      border: 1px solid var(--warning-border, #ffb74d);
      border-radius: 8px;
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--warning-text, #e65100);
      text-align: justify;
    }

    .warning-icon {
      font-size: 1rem;
      margin-bottom: 4px;
      display: block;
      text-align: center;
    }

    .macro-display {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 12px;
      padding: 12px;
      background: var(--card-background-secondary, #f5f5f5);
      border-radius: 8px;
    }

    .macro-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .macro-label {
      font-size: 0.75rem;
      color: var(--text-color-secondary, #666);
      font-weight: 500;
    }

    .macro-value {
      font-size: 1rem;
      font-weight: bold;
      color: var(--text-color, #191c25);
    }

    .macro-protein { color: var(--protein-color, #4fb9ad); }
    .macro-carbs { color: var(--carbs-color, #ffb74d); }
    .macro-fat { color: var(--fat-color, #f44336); }
  `];

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('height')) this._height = this.height;
    if (changedProperties.has('weight')) this._weight = this.weight;
    if (changedProperties.has('gender')) this._gender = this.gender;
    if (changedProperties.has('age')) this._age = this.age;
  }

  private _calculateCalories(): number {
    if (!this._height || !this._weight || !this._age || !this._gender) return 0;

    let bmr = 0;
    if (this._gender === 'male') {
      bmr = (10 * this._weight) + (6.25 * this._height) - (5 * this._age) + 5;
    } else {
      bmr = (10 * this._weight) + (6.25 * this._height) - (5 * this._age) - 161;
    }

    const totalCalories = Math.round(bmr * this.activityLevel);

    this.dispatchEvent(new CustomEvent('calories-calculated', {
      detail: {
        calories: totalCalories,
        protein: Math.round((totalCalories * (this.proteinRatio / 100)) / 4),
        carbs: Math.round((totalCalories * (this.carbsRatio / 100)) / 4),
        fat: Math.round((totalCalories * (this.fatRatio / 100)) / 9)
      },
      bubbles: true,
      composed: true
    }));

    return totalCalories;
  }

  private _onDietTypeChange(e: any) {
    this.dietType = e.target.value;
    switch (this.dietType) {
      case 'balanced':
        this.proteinRatio = 20;
        this.carbsRatio = 50;
        this.fatRatio = 30;
        break;
      case 'lowCarb':
        this.proteinRatio = 25;
        this.carbsRatio = 45;
        this.fatRatio = 30;
        break;
      case 'lowFat':
        this.proteinRatio = 15;
        this.carbsRatio = 65;
        this.fatRatio = 20;
        break;
      case 'highProtein':
        this.proteinRatio = 35;
        this.carbsRatio = 45;
        this.fatRatio = 20;
        break;
    }
  }

  _handleSave() {
    const calories = this._calculateCalories();
    this.dispatchEvent(new CustomEvent('save-calories', {
      detail: {
        calories,
        height: this._height,
        weight: this._weight,
        gender: this._gender,
        age: this._age,
        activityLevel: this.activityLevel,
        proteinRatio: this.proteinRatio,
        carbsRatio: this.carbsRatio,
        fatRatio: this.fatRatio
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const calories = this._calculateCalories();

    return html`
      <div class="form-container">
        <div class="header">
          <h2>${this.translationsTexts['maintenanceCaloriesTitle'] || 'Basal Metabolic Rate'}</h2>
          <div class="subtitle">
            ${this.translationsTexts['mifflinStJeorSubtitle'] || 'Calculation based on the'}
            <a href="https://en.wikipedia.org/wiki/Basal_metabolic_rate#Mifflin-St_Jeor_equation" target="_blank" rel="noopener">Mifflin-St Jeor</a>
            ${this.translationsTexts['methodLabel'] || 'method'}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>📏 ${this.translationsTexts['height'] || 'Height'} (cm)</label>
            <input type="number" .value="${String(this._height)}" @input="${(e: any) => this._height = Number(e.target.value)}">
          </div>
          <div class="form-group">
            <label>⚖️ ${this.translationsTexts['weight'] || 'Weight'} (kg)</label>
            <input type="number" .value="${String(this._weight)}" @input="${(e: any) => this._weight = Number(e.target.value)}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>👤 ${this.translationsTexts['gender'] || 'Gender'}</label>
            <select .value="${this._gender}" @change="${(e: any) => this._gender = e.target.value}">
              <option value="" disabled>${this.translationsTexts['select'] || 'Select...'}</option>
              <option value="male">${this.translationsTexts['male'] || 'Male'}</option>
              <option value="female">${this.translationsTexts['female'] || 'Female'}</option>
            </select>
          </div>
          <div class="form-group">
            <label>🎂 ${this.translationsTexts['age'] || 'Age'}</label>
            <input type="number" .value="${String(this._age)}" @input="${(e: any) => this._age = Number(e.target.value)}">
          </div>
        </div>

        <div class="form-group">
          <label>🏃 ${this.translationsTexts['activityLevel'] || 'Activity Level'}</label>
          <select .value="${this.activityLevel}" @change="${(e: any) => this.activityLevel = e.target.value}">
            <option value="1.2">${this.translationsTexts['sedentary'] || 'Sedentary (little or no exercise)'}</option>
            <option value="1.375">${this.translationsTexts['lightlyActive'] || 'Lightly active (light exercise/sports 1-3 days/week)'}</option>
            <option value="1.55">${this.translationsTexts['moderatelyActive'] || 'Moderately active (moderate exercise/sports 3-5 days/week)'}</option>
            <option value="1.725">${this.translationsTexts['veryActive'] || 'Very active (hard exercise/sports 6-7 days a week)'}</option>
            <option value="1.9">${this.translationsTexts['extraActive'] || 'Extra active (very hard exercise/sports & physical job)'}</option>
          </select>
        </div>

        <div class="form-group">
          <label>🍽️ ${this.translationsTexts['dietType'] || 'Diet Type'}</label>
          <select .value="${this.dietType}" @change="${this._onDietTypeChange}">
            <option value="balanced">${this.translationsTexts['balanced'] || 'Balanced'}</option>
            <option value="lowCarb">${this.translationsTexts['lowCarb'] || 'Low Carb'}</option>
            <option value="lowFat">${this.translationsTexts['lowFat'] || 'Low Fat'}</option>
            <option value="highProtein">${this.translationsTexts['highProtein'] || 'High Protein'}</option>
          </select>
        </div>

        ${calories > 0 ? html`
          ${this.showWarning ? html`
            <div class="warning-message">
              <span class="warning-icon">⚠️</span>
              ${this.translationsTexts['metabolicWarning'] || 'Important considerations: This metabolic estimation relies on statistical models for the general population and does not account for individual variations in body composition (muscle vs. fat). These calculations should be used as general guidance only. For a precise and safe nutritional approach, we strongly recommend professional medical or dietetic supervision, as self-directed calorie monitoring can be associated with the development of disordered eating patterns.'}
            </div>
          ` : ''}
          <div class="result-container">
            <div class="result-label">${this.translationsTexts['dailyCalories'] || 'Maintenance Calories'}</div>
            <div class="result-value">${calories} ${this.translationsTexts['kcal'] || 'kcal'}</div>
            
            <div class="macro-display">
              <div class="macro-item">
                <span class="macro-label">${this.translationsTexts['protein'] || 'Protein'}</span>
                <span class="macro-value macro-protein">${this.proteinRatio}%</span>
                <span class="macro-label">${Math.round((calories * (this.proteinRatio / 100)) / 4)}g</span>
              </div>
              <div class="macro-item">
                <span class="macro-label">${this.translationsTexts['carbs'] || 'Carbs'}</span>
                <span class="macro-value macro-carbs">${this.carbsRatio}%</span>
                <span class="macro-label">${Math.round((calories * (this.carbsRatio / 100)) / 4)}g</span>
              </div>
              <div class="macro-item">
                <span class="macro-label">${this.translationsTexts['fat'] || 'Fat'}</span>
                <span class="macro-value macro-fat">${this.fatRatio}%</span>
                <span class="macro-label">${Math.round((calories * (this.fatRatio / 100)) / 9)}g</span>
              </div>
            </div>
          </div>
          <button class="save-button" @click="${this._handleSave}">
            ${this.translationsTexts['save'] || 'Save'}
          </button>
        ` : ''}
      </div>
    `;
  }
}
