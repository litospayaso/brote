import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { ProductInterface } from '../../shared/http.interfaces';
import type { MealCategory } from '../../shared/db';

@api({ getProduct })
export default class PageFood extends Page<{ getProduct: typeof getProduct }> {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 20px;
        font-family: sans-serif;
      }
      .page-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .loading-container {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      .emoji-container {
        border: 1px solid var(--card-border);
        background: var(--card-background, #fff);
        padding: 20px 10px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .product-header {
        text-align: center;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .product-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
      }
      .favorite-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
      }
      .favorite-icon {
        width: 32px;
        height: 32px;
        fill: none;
        stroke: var(--palette-grey, #666);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: fill 0.3s ease, stroke 0.3s ease;
      }
      .favorite-icon.is-favorite {
        fill: var(--favorite-color, #ffd700);
        stroke: var(--favorite-color, #ffd700);
      }
      .calculator {
        background: var(--section-background);
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        margin-top: 1rem;
        position: relative;
        max-width: 600px;
        margin: 16px auto;
      }
      .input-group {
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: 140px 1fr;
        align-items: center;
        gap: 10px;
      }

      @media (max-width: 600px) {
        .input-group {
          grid-template-columns: 1fr;
          gap: 5px;
        }
      }

      .input-group label {
        font-weight: bold;
        color: var(--card-text, #333);
      }
      .input-group input,
      .input-group select {
        padding: 8px;
        background: var(--input-background);
        color: var(--input-text);
        border: 1px solid var(--input-border, #ccc);
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
      }
      .nutrients-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .nutrient-item {
        background: var(--card-background);
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid var(--card-border);
      }
      .nutrient-item.calories {
        border-color: var(--calories-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.carbs {
        border-color: var(--carbs-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.fat {
        border-color: var(--fat-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.protein {
        border-color: var(--protein-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-value {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--card-text, #333);
      }
      .nutrient-label {
        color: var(--input-placeholder, #666);
        font-size: 0.875rem;
      }
      .error-message {
        color: red;
        text-align: center;
      }
      .add-to-diary-button {
        margin-top: 20px;
        width: 100%;
        padding: 12px;
        border: none;
        background-color: var(--group-button-active-bg, var(--palette-green));
        color: var(--group-button-active-text, #fff);
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
      }
      .save-edit-button {
        background-color: var(--palette-purple, #a285bb);
      }
      .edit-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0 10px;
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
      }
      .name-input {
        font-size: 2em;
        font-weight: bold;
        margin: 0.67em 0;
        width: 100%;
        padding: 5px;
        border: 1px solid var(--input-border, #ccc);
        border-radius: 4px;
        background: var(--input-background);
        color: var(--input-text);
        text-align: center;
      }
      .brand-input {
        font-size: 1em;
        margin: 0.5em 0;
        width: 100%;
        padding: 5px;
        border: 1px solid var(--input-border, #ccc);
        border-radius: 4px;
        background: var(--input-background);
        color: var(--input-text);
        text-align: center;
      }
      .product-brand {
        font-size: 1rem;
        color: var(--input-placeholder, #666);
      }
      .calculator-top {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
      }

      .chart-section {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .inputs-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
        margin-top: 30px;
      }

      @media (min-width: 600px) {
        .calculator-top {
          flex-direction: row;
          align-items: center;
        }
        .chart-section {
          order: 2;
          flex: 1;
        }
        .inputs-section {
          order: 1;
          margin-top: 0;
        }
      }
    `,
  ];

  @state() product: ProductInterface | null = null;
  @state() editedProduct: ProductInterface | null = null;
  @state() isEditing: boolean = false;
  @state() loading: boolean = false;
  @state() error: string = '';
  @state() grams: number = 100;
  @state() isFavoriteState: boolean = false;
  @state() selectedDate: string = new Date().toISOString().split('T')[0];
  @state() selectedCategory: MealCategory = 'breakfast';
  @state() mealId: string | null = null;

  async onPageInit(): Promise<void> {
    const params = this.getQueryParamsURL();
    const code = params.get('code');
    this.selectedCategory = params.get('category') as MealCategory || 'breakfast';
    this.mealId = params.get('mealId');

    if (code) {
      this.loading = true;
      try {
        await this.db.init();
        this.isFavoriteState = await this.db.isFavorite(code);

        const cached = await this.db.getCachedProduct(code);
        if (cached) {
          this.product = cached;
          if (this.product && this.product.product?.default_grams) {
            this.grams = this.product.product.default_grams;
          }
          this.loading = false;
        } else {
          const response = await this.api.getProduct(code);
          if (response && response.product) {
            this.product = response;
            if (this.product.product?.default_grams) {
              this.grams = this.product.product.default_grams;
            }
            await this.db.cacheProduct(response);
          } else {
            this._initNewProduct(code, params.get('query'));
          }
        }
      } catch (err) {
        console.warn('Product not found, initializing new:', err);
        this._initNewProduct(code, params.get('query'));
      } finally {
        this.loading = false;
      }
    } else {
      this.error = 'No product code provided';
    }
  }

  private _initNewProduct(code: string, queryName: string | null) {
    this.product = {
      code: code,
      status: '1',
      status_verbose: 'product found',
      product: {
        product_name: queryName || this.translations.unknownProduct || 'New Product',
        brands: '',
        nutriments: {
          'energy-kcal_100g': 0,
          carbohydrates_100g: 0,
          fat_100g: 0,
          proteins_100g: 0,
          'energy-kcal': 0,
          carbohydrates: 0,
          fat: 0,
          proteins: 0
        } as any
      }
    };
    this._toggleEditMode();
  }

  private async _toggleFavorite() {
    if (!this.product) return;
    const code = this.product.code;
    if (this.isFavoriteState) {
      await this.db.removeFavorite(code);
      this.isFavoriteState = false;
    } else {
      await this.db.addFavorite(code);
      this.isFavoriteState = true;
    }
  }

  private _handleGramsChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const val = Number(input.value);
    if (val >= 0) {
      this.grams = val;
    }
  }

  private _calculateNutrient(value100g: number | undefined): string {
    if (value100g === undefined || value100g === null) return '-';
    return ((value100g * this.grams) / 100).toFixed(1);
  }

  private _toggleEditMode() {
    if (this.isEditing) {
      this.isEditing = false;
      this.editedProduct = null;
    } else {
      if (this.product) {
        this.editedProduct = JSON.parse(JSON.stringify(this.product));
        this.isEditing = true;
      }
    }
  }

  private _handleNutrientChange(e: Event, key: string) {
    if (!this.editedProduct || !this.editedProduct.product) return;
    const input = e.target as HTMLInputElement;
    const val = Number(input.value);

    if (!this.editedProduct.product.nutriments) {
      this.editedProduct.product.nutriments = {} as any;
    }

    (this.editedProduct.product.nutriments as any)[key] = val;

    if (key === 'energy-kcal_100g') {
      (this.editedProduct.product.nutriments as any)['energy-kcal'] = val;
    }

    this.requestUpdate();
  }

  private _handleNameChange(e: Event) {
    if (!this.editedProduct || !this.editedProduct.product) return;
    const input = e.target as HTMLInputElement;
    (this.editedProduct.product as any).product_name = input.value;
    this.requestUpdate();
  }

  private _handleBrandChange(e: Event) {
    if (!this.editedProduct || !this.editedProduct.product) return;
    const input = e.target as HTMLInputElement;
    (this.editedProduct.product as any).brands = input.value;
    this.requestUpdate();
  }

  private async _saveEdit() {
    if (this.editedProduct) {
      this.product = this.editedProduct;
      if (this.product.product) {
        this.product.product.default_grams = this.grams;
      }
      await this.db.cacheProduct(this.product);
      await this.db.updateProductInMeals(this.product);
      await this.db.updateProductInLogs(this.product);
      this.isEditing = false;
      this.editedProduct = null;
    }
  }

  private async _addToDiary() {
    if (!this.product) return;

    try {
      const foodItem = {
        product: {
          code: this.product.code,
          nutriments: {
            "energy-kcal": this.product.product?.nutriments?.["energy-kcal_100g"] || 0,
            carbohydrates: this.product.product?.nutriments?.carbohydrates_100g || 0,
            fat: this.product.product?.nutriments?.fat_100g || 0,
            proteins: this.product.product?.nutriments?.proteins_100g || 0,
          } as any,
          product_name: (this.product.product as any).product_name,
          nutrition_data: 'per_100g',
          nutrition_data_per: '100g',
          nutrition_data_prepared_per: '100g',
          brands: (this.product.product as any).brands
        },
        quantity: this.grams,
        unit: 'g'
      };

      await this.db.addFoodItem(this.selectedDate, this.selectedCategory, foodItem);

      this.triggerPageNavigation({ page: 'home', maintainParams: 'false' },);

    } catch (e) {
      console.error("Error adding to diary", e);
      this.error = this.translations.errorAddingToDiary || "Failed to add to diary";
    }
  }

  private async _addToMeal() {
    if (!this.product || !this.mealId) return;

    try {
      const meal = await this.db.getMeal(this.mealId);
      if (meal) {
        const foodItem = {
          product: {
            code: this.product.code,
            nutriments: {
              "energy-kcal": this.product.product?.nutriments?.["energy-kcal_100g"] || 0,
              carbohydrates: this.product.product?.nutriments?.carbohydrates_100g || 0,
              fat: this.product.product?.nutriments?.fat_100g || 0,
              proteins: this.product.product?.nutriments?.proteins_100g || 0,
            } as any,
            product_name: (this.product.product as any).product_name,
            nutrition_data: 'per_100g',
            nutrition_data_per: '100g',
            nutrition_data_prepared_per: '100g',
            brands: (this.product.product as any).brands
          },
          quantity: this.grams,
          unit: 'g'
        };

        if (!meal.foods) meal.foods = [];
        meal.foods.push(foodItem);

        await this.db.saveMeal(meal);
        this.triggerPageNavigation({ page: 'meal', mealId: this.mealId });
      } else {
        this.error = this.translations.errorMealNotFound || "Meal not found in database";
      }
    } catch (e) {
      console.error("Error adding to meal", e);
      this.error = this.translations.errorAddingToMeal || "Failed to add to meal";
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="page-container">
          <div class="loading-container">
            <component-spinner></component-spinner>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
            <div class="page-container">
                <div class="error-message">${this.error}</div>
            </div>
        `;
    }

    if (!this.product) {
      return html``;
    }

    return html`
      <div class="page-container">
        <div class="product-header">
          <div class="emoji-container">
            <component-emoji text="${(this.product.product as any).product_name || this.translations.unknownProduct}" size="l"></component-emoji>
          </div>
          </div>
          <div class="product-name">
            ${this.isEditing
        ? html`
            <div style="width: 100%;">
              <input 
                class="name-input"
                type="text" 
                .value="${(this.editedProduct?.product as any).product_name || ''}" 
                @input="${this._handleNameChange}"
                placeholder="${this.translations.productName}"
              />
              <input 
                class="brand-input"
                type="text" 
                .value="${(this.editedProduct?.product as any).brands || ''}" 
                @input="${this._handleBrandChange}"
                placeholder="${this.translations.brand}"
              />
            </div>
          `
        : html`
            <div style="text-align: center;">
              <h1 class="product-name-title">${(this.product.product as any).product_name || this.translations.unknownProduct}</h1>
              ${(this.product.product as any).brands ? html`<div class="product-brand">${(this.product.product as any).brands}</div>` : ''}
            </div>
        `
      }
      ${!this.isEditing ? html`
        <button 
          @click="${this._toggleFavorite}" 
          class="favorite-btn"
          aria-label="${this.isFavoriteState ? this.translations.removeFromFavorites : this.translations.addToFavorites}"
        >
          <svg
            class="favorite-icon ${this.isFavoriteState ? 'is-favorite' : ''}"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
        ` : ''}
          </div>
        </div>
        <div class="calculator">
          ${!this.mealId ? html`
            <button class="edit-btn" @click="${this._toggleEditMode}">
              ${this.isEditing ? '❌' : '✏️'}
            </button>
            ` : ''}
            <div class="calculator-top">
              <div class="inputs-section">
                <div class="input-group">
                    <label for="grams">${this.translations.quantity} (${this.translations.grams}):</label>
                    <input 
                        id="grams" 
                        type="number" 
                        .value="${this.grams.toString()}" 
                        @input="${this._handleGramsChange}"
                        min="0"
                    />
                </div>
                ${!this.mealId ? html`
                <div class="input-group">
                  <label for="date">${this.translations.date}:</label>
                  <input 
                    id="date" 
                    type="date" 
                    .value="${this.selectedDate}" 
                    @change="${(e: Event) => this.selectedDate = (e.target as HTMLInputElement).value}"
                  />
                </div>

                <div class="input-group">
                  <label for="category">${this.translations.category}:</label>
                  <select 
                    id="category" 
                    .value="${this.selectedCategory}" 
                    @change="${(e: Event) => this.selectedCategory = (e.target as HTMLInputElement).value as MealCategory}"
                    style="padding: 8px; background: var(--input-background); color: var(--input-text); border: 1px solid var(--input-border, #ccc); border-radius: 4px; width: 100%; box-sizing: border-box;"
                  >
                    <option value="breakfast">${this.translations.breakfast}</option>
                    <option value="snack1">${this.translations.snackMorning}</option>
                    <option value="lunch">${this.translations.lunch}</option>
                    <option value="snack2">${this.translations.snackAfternoon}</option>
                    <option value="dinner">${this.translations.dinner}</option>
                    <option value="snack3">${this.translations.snackEvening}</option>
                  </select>
                </div>
                  ` : ''
      }
              </div>

              <div class="chart-section">
                <component-pie-chart
                  .protein="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.proteins_100g || 0}"
                  .carbs="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.carbohydrates_100g || 0}"
                  .fat="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.fat_100g || 0}"
                >
                  <div style="display: flex; flex-direction: column; align-items: center;">
                      <span style="font-weight: bold; font-size: 1.2rem;">
                          ${Math.round((this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.['energy-kcal_100g'] || 0)}
                      </span>
                      <span style="font-size: 0.7rem; color: var(--input-placeholder, #666);">kcal/100g</span>
                  </div>
                </component-pie-chart>
              </div>
            </div>

            <div class="nutrients-grid">
                <div class="nutrient-item calories">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.['energy-kcal_100g'] || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'energy-kcal_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.['energy-kcal_100g'])}
                    </div>
                    <div class="nutrient-label">${this.isEditing ? this.translations.calories + ' (kcal / 100g)' : this.translations.calories + ' (kcal)'}</div>
                </div>
                <div class="nutrient-item carbs">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.carbohydrates_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'carbohydrates_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.carbohydrates_100g)}
                    </div>
                    <div class="nutrient-label">${this.isEditing ? this.translations.carbs + ' (g / 100g)' : this.translations.carbs + ' (g)'}</div>
                </div>
                <div class="nutrient-item protein">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.proteins_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'proteins_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.proteins_100g)}
                    </div>
                    <div class="nutrient-label">${this.isEditing ? this.translations.protein + ' (g / 100g)' : this.translations.protein + ' (g)'}</div>
                </div>
                <div class="nutrient-item fat">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.fat_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'fat_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.fat_100g)}
                    </div>
                    <div class="nutrient-label">${this.isEditing ? this.translations.fat + ' (g / 100g)' : this.translations.fat + ' (g)'}</div>
                </div>
            </div>

             ${this.isEditing ? html`
              <button 
                @click="${this._saveEdit}"
                class="add-to-diary-button save-edit-button"
              >
                ${this.translations.saveEdit}
              </button>
             ` : (this.mealId ? html`
              <button 
                @click="${this._addToMeal}"
                class="add-to-diary-button"
              >
                ${this.translations.addToMeal}
              </button>
             ` : html`
              <button 
                @click="${this._addToDiary}"
                class="add-to-diary-button"
              >
                ${this.translations.addToDiary}
              </button>
             `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-food': PageFood
  }
}
