import { html, css, type PropertyValueMap } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { type DailyLog, type MealCategory, type UserStatus } from '../../shared/db';

export default class PageHome extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 20px;
      }
      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
      }
      .date-selector {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.2rem;
        font-weight: bold;
      }
      .date-selector button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: var(--text-color);
        z-index: 2;
      }
      .date-display {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .date-display span {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--text-color);
      }
      .date-display input[type="date"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 1;
      }
      .progress-container{
        margin: 16px 0;
      }
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 30px;
      }
      .summary-card {
        background: var(--card-background);
        border: 1px solid var(--card-border);
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .summary-card.calories {
        border-color: var(--calories-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.carbs {
        border-color: var(--carbs-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.fat {
        border-color: var(--fat-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.protein {
        border-color: var(--protein-color);
        border-width: var(--counter-border-width);
      }
      .summary-card .value {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--card-text);
      }
      .summary-card .label {
        font-size: 0.8rem;
        color: var(--input-placeholder);
      }
      .category-section {
        margin-bottom: 20px;
      }
      .category-header {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--palette-purple);
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        text-transform: capitalize;
      }
      .add-button svg {
        fill: var(--palette-purple);
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
      .empty-message {
        color: var(--input-placeholder);
        font-style: italic;
        font-size: 0.9rem;
      }
      .grid-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
      }

      @media (max-width: 600px) {
        .summary-cards {
            grid-template-columns: 1fr 1fr;
        }
      }
    `
  ];

  @state() currentDate: string = new Date().toISOString().split('T')[0];
  @state() dailyLog: DailyLog | null = null;
  @state() userStatus: UserStatus | null = null;
  @state() loading: boolean = true;
  @state() totals = { calories: 0, carbs: 0, fat: 0, protein: 0 };
  @state() userGoals = {
    calories: 2000,
    defaultBasalCalories: 0,
    macros: { protein: 30, carbs: 40, fat: 30 }
  };
  @state() openStatusModal: boolean = false;

  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    super.firstUpdated(_changedProperties);
    this.loadUserProfile();
    await this.loadData();
  }

  onPageInit(): void {
    const params = this.getQueryParamsURL();
    if (params.get('openStatus') === 'true') {
      setTimeout(() => {
        this.openStatusModal = true;
      }, 100);
    }
  }

  loadUserProfile() {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.goals) {
          this.userGoals = {
            ...this.userGoals,
            ...profile.goals,
            macros: {
              ...this.userGoals.macros,
              ...(profile.goals.macros || {})
            },
            defaultBasalCalories: profile.goals.defaultBasalCalories || 0
          };
        }
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
  }

  async loadData() {
    this.loading = true;
    try {
      this.dailyLog = await this.db.getDailyLog(this.currentDate);
      this.userStatus = await this.db.getUserStatus(this.currentDate);
      this.calculateTotals();
    } catch (e) {
      console.error("Failed to load daily log", e);
    } finally {
      this.loading = false;
    }
  }

  calculateTotals() {
    if (!this.dailyLog) {
      this.totals = { calories: 0, carbs: 0, fat: 0, protein: 0 };
      return;
    }

    let calories = 0, carbs = 0, fat = 0, protein = 0;

    const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

    categories.forEach(cat => {
      this.dailyLog![cat].forEach(item => {
        const ratio = item.unit === 'meal' ? item.quantity : item.quantity / 100;

        calories += (item.product.nutriments['energy-kcal'] || 0) * ratio;
        carbs += (item.product.nutriments.carbohydrates || 0) * ratio;
        fat += (item.product.nutriments.fat || 0) * ratio;
        protein += (item.product.nutriments.proteins || 0) * ratio;
      });
    });

    this.totals = {
      calories: Math.round(calories),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      protein: Math.round(protein)
    };
  }

  changeDate(days: number) {
    const date = new Date(this.currentDate);
    date.setDate(date.getDate() + days);
    this.currentDate = date.toISOString().split('T')[0];
    this.loadData();
  }

  _handleDateChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.value) {
      this.currentDate = input.value;
      this.loadData();
    }
  }

  _handleDateDisplayClick() {
    const input = this.shadowRoot?.querySelector('.date-display input[type="date"]') as HTMLInputElement;
    if (input && 'showPicker' in input) {
      try {
        (input as any).showPicker();
      } catch (err) {
        console.warn('showPicker not supported or failed', err);
      }
    }
  }

  getFormattedDate(): string {
    const today = new Date();
    const date = new Date(this.currentDate);

    const resetTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const dToday = resetTime(today);
    const dDate = resetTime(date);

    const diffTime = dDate.getTime() - dToday.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return this.translations.today;
    if (diffDays === 1) return this.translations.tomorrow;
    if (diffDays === -1) return this.translations.yesterday;

    return this.currentDate.split('-').reverse().join('/');
  }

  render() {
    return html`
      <div class="header">
        <div class="date-selector">
           <button @click="${() => this.changeDate(-1)}">‹</button>
           <div class="date-display" @click="${this._handleDateDisplayClick}">
             <span>${this.getFormattedDate()}</span>
             <input type="date" .value="${this.currentDate}" @change="${this._handleDateChange}" />
           </div>
           <button @click="${() => this.changeDate(1)}">›</button>
        </div>
      </div>

      <component-user-status
        .exerciseCalories=${this.userStatus?.exerciseCalories || 0}
        .basalCalories=${this.userStatus?.basalCalories || this.userGoals.defaultBasalCalories || 0}
        .steps=${this.userStatus?.steps || 0}
        .sleepHours=${this.userStatus?.sleepHours || 0}
        .energyLevel=${this.userStatus?.energyLevel || 0}
        .hungerLevel=${this.userStatus?.hungerLevel || 0}
        .thoughts=${this.userStatus?.thoughts || ''}
        .translations=${JSON.stringify(this.translations)}
        .open=${this.openStatusModal}
        @status-changed="${this._handleStatusChanged}"
      ></component-user-status>

      <div class="progress-container">
        <component-progress-bar
            .dailyCaloriesGoal=${this.userGoals.calories}
            .caloriesEaten=${this.totals.calories}
            .fatEaten=${this.totals.fat}
            .carbsEaten=${this.totals.carbs}
            .proteinEaten=${this.totals.protein}
            .fatGoalPercent=${this.userGoals.macros.fat}
            .carbsGoalPercent=${this.userGoals.macros.carbs}
            .proteinGoalPercent=${this.userGoals.macros.protein}
            .fatEatenPercent=${((this.totals.fat * 9) / ((this.totals.fat * 9 + this.totals.carbs * 4 + this.totals.protein * 4) || 1)) * 100}
            .carbsEatenPercent=${((this.totals.carbs * 4) / ((this.totals.fat * 9 + this.totals.carbs * 4 + this.totals.protein * 4) || 1)) * 100}
            .proteinEatenPercent=${((this.totals.protein * 4) / ((this.totals.fat * 9 + this.totals.carbs * 4 + this.totals.protein * 4) || 1)) * 100}
            .translations=${JSON.stringify(this.translations)}
        ></component-progress-bar>
      </div>

      <div class="summary-cards">
        <div class="summary-card calories">
          <span class="value">${this.totals.calories}</span>
          <span class="label">${this.translations.calories}</span>
        </div>
        <div class="summary-card carbs">
          <span class="value">${this.totals.carbs}g</span>
          <span class="label">${this.translations.carbs}</span>
        </div>
        <div class="summary-card fat">
          <span class="value">${this.totals.fat}g</span>
          <span class="label">${this.translations.fat}</span>
        </div>
        <div class="summary-card protein">
          <span class="value">${this.totals.protein}g</span>
          <span class="label">${this.translations.protein}</span>
        </div>
      </div>

      ${this.renderCategory(this.translations.breakfast, 'breakfast')}
      ${this.renderCategory(this.translations.snackMorning, 'snack1')}
      ${this.renderCategory(this.translations.lunch, 'lunch')}
      ${this.renderCategory(this.translations.snackAfternoon, 'snack2')}
      ${this.renderCategory(this.translations.dinner, 'dinner')}
      ${this.renderCategory(this.translations.snackEvening, 'snack3')}

      ${!this.dailyLog || (
        this.dailyLog.breakfast.length === 0 &&
        this.dailyLog.snack1.length === 0 &&
        this.dailyLog.lunch.length === 0 &&
        this.dailyLog.snack2.length === 0 &&
        this.dailyLog.dinner.length === 0 &&
        this.dailyLog.snack3.length === 0
      ) ? html`
        <component-day-tip .language="${this.getLanguage()}"></component-day-tip>
        <button class="btn" @click="${() => this.triggerPageNavigation({ page: 'search' })}">${this.translations.addFood}</button>
      ` : ''}
    `;
  }


  async _handleRemoveItem(category: MealCategory, index: number) {
    if (!this.dailyLog) return;
    try {
      await this.db.removeFoodItem(this.currentDate, category, index);
      this.loadData();
    } catch (e) {
      console.error("Failed to remove item", e);
    }
  }

  async _handleStatusChanged(e: CustomEvent) {
    const { exerciseCalories, basalCalories, steps, sleepHours, energyLevel, hungerLevel, thoughts } = e.detail;

    this.userStatus = {
      date: this.currentDate,
      exerciseCalories,
      basalCalories,
      steps,
      sleepHours,
      energyLevel,
      hungerLevel,
      thoughts
    };

    try {
      await this.db.saveUserStatus(this.userStatus);
    } catch (err) {
      console.error("Failed to save user status", err);
    }
  }

  private _handleElementClick(item: any) {
    if (item.unit === 'meal') {
      this.triggerPageNavigation({ page: 'meal', mealId: item.product.code });
    } else {
      this.triggerPageNavigation({ page: 'food', code: item.product.code });
    }
  }

  renderCategory(title: string, category: MealCategory) {
    const items = this.dailyLog ? this.dailyLog[category] : [];

    if (items.length === 0) return html``;

    return html`
      <div class="category-section">
        <div class="category-header">
          <span>
            ${title} (${items.reduce((acc, item) => acc + ((item.product.nutriments['energy-kcal'] || 0) * (item.unit === 'meal' ? item.quantity : item.quantity / 100)), 0).toFixed(0)} kcal)
          </span>
          <span class="add-button" @click="${() => this.triggerPageNavigation({ page: 'search', category })}">
            <svg  width="30px" height="30px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 27.9296 39.1328 C 29.1952 39.1328 29.9452 38.2656 29.9452 36.9063 L 29.9452 29.9688 L 37.2812 29.9688 C 38.5936 29.9688 39.5077 29.2890 39.5077 28.0469 C 39.5077 26.7812 38.6405 26.0547 37.2812 26.0547 L 29.9452 26.0547 L 29.9452 18.6953 C 29.9452 17.3125 29.1952 16.4688 27.9296 16.4688 C 26.6874 16.4688 26.0077 17.3594 26.0077 18.6953 L 26.0077 26.0547 L 18.6952 26.0547 C 17.3124 26.0547 16.4452 26.7812 16.4452 28.0469 C 16.4452 29.2890 17.3827 29.9688 18.6952 29.9688 L 26.0077 29.9688 L 26.0077 36.9063 C 26.0077 38.2188 26.6874 39.1328 27.9296 39.1328 Z"/></svg>
          </span>
        </div>
        ${items.map((item, index) => html`
            <component-search-result
            name="${item.product.product_name}"
            code="${item.product.code}"
            brands="${item.product.brands || ''}"
            calories="${((item.product.nutriments['energy-kcal'] || 0) * (item.unit === 'meal' ? item.quantity : item.quantity / 100)).toFixed(0)}"
            quantity="${item.unit !== 'meal' ? `${item.quantity}${item.unit}` : ''}"
            removable="true"
            @element-click="${() => this._handleElementClick(item)}"
            @remove-click="${() => this._handleRemoveItem(category, index)}"
            ></component-search-result>
        `)}
      </div>
    `;
  }
}
