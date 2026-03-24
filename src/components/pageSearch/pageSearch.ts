import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { searchProduct, getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { SearchProductItemInterface } from '../../shared/http.interfaces';

@api({ searchProduct, getProduct })
export default class PageSearch extends Page<{ searchProduct: typeof searchProduct, getProduct: typeof getProduct }> {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 20px;
        font-family: sans-serif;
        color: var(--text-color);
      }
      .page-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
      }
      .group-button-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
      .search-container component-search-input{
        flex: 1;
      }
      .btn-create {
        margin-bottom: 16px;
      }
      button.scan-btn {
        padding: 0;
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        padding:8px;
        cursor: pointer;
        background-color: var(--card-background-color, var(--palette-green));
        color: var(--text-color);
        box-shadow: rgba(0, 0, 0, 0.2) 2px 8px 12px;
        border: none;
        border-radius: 50%;
        transition: transform 0.2s ease, background-color 0.3s ease;
        margin-left: 10px;
      }
      button.scan-btn:hover {
        background: var(--selected-group-button-color);
        color: var(--group-button-active-text, #fff);
      }
      button.scan-btn:active {
        background: var(--selected-group-button-color);
        color: var(--group-button-active-text, #fff);
      }
      .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      .search-result-container {
        min-height: calc(100vh - 450px);
      }
      h1 {
        text-align: center;
      }
    `,
  ];

  @state() searchResult: (SearchProductItemInterface & { isFavorite?: boolean })[] = [];
  @state() loading: boolean = false;
  @state() mealId: string | null = null;

  @state() query: string = '';

  protected handleSwipe(diffX: number): void {
    if (this.viewMode === 'cached') {
      if (diffX > 0) {
        // Swipe left
        this.triggerPageNavigation({ page: 'home' });
      } else {
        // Swipe right
        this._switchMode('favorites');
      }
    }
    else if (this.viewMode === 'favorites') {
      if (diffX > 0) {
        // Swipe right
        this._switchMode('cached');
      } else {
        // Swipe left
        this._switchMode('search');
      }
    } else if (this.viewMode === 'search') {
      if (diffX > 0) {
        // Swipe right
        this._switchMode('favorites');
      } else {
        // Swipe left
        this._switchMode('meals');
      }
    } else if (this.viewMode === 'meals') {
      if (diffX < 0) {
        // Swipe right
        this.triggerPageNavigation({ page: 'user' });
      } else {
        // Swipe left
        this._switchMode('search');
      }
    }
  }

  @state() viewMode: 'cached' | 'favorites' | 'search' | 'meals' = 'cached';
  @state() groupButtonOptions = [
    { text: this.translations.recents, id: 'cached', active: true },
    { text: this.translations.favorites, id: 'favorites', active: false },
    { text: this.translations.search, id: 'search', active: false },
    { text: this.translations.meals, id: 'meals', active: false }
  ];

  async onPageInit(): Promise<void> {
    await this.db.init();
    const params = this.getQueryParamsURL();
    const viewMode = params.get('viewMode');
    this.mealId = params.get('mealId');

    if (this.mealId) {
      this.groupButtonOptions = [
        { text: this.translations.recents, id: 'cached', active: true },
        { text: this.translations.favorites, id: 'favorites', active: false },
        { text: this.translations.search, id: 'search', active: false }
      ]
    } else {
      this.groupButtonOptions = [
        { text: this.translations.recents, id: 'cached', active: true },
        { text: this.translations.favorites, id: 'favorites', active: false },
        { text: this.translations.search, id: 'search', active: false },
        { text: this.translations.meals, id: 'meals', active: false }
      ]
    }

    if (viewMode && ['cached', 'favorites', 'search', 'meals'].includes(viewMode)) {
      this._switchMode(viewMode as any);
    } else {
      const cachedProducts = await this.db.getAllCachedProducts();
      if (!cachedProducts || cachedProducts.length === 0) {
        this._switchMode('search');
      } else {
        this._loadData();
      }
    }
  }

  private async _loadData() {
    this.loading = true;
    try {
      let products: any[] = [];

      if (this.viewMode === 'cached') {
        products = await this.db.getAllCachedProducts();
        if (products && products.length > 0 && this.query) {
          products = products.filter(p => {
            const name = p.product_name || p.product?.product_name || '';
            const brands = p.brands || p.product?.brands || '';
            const lowerQuery = this.query.toLowerCase();
            return name.toLowerCase().includes(lowerQuery) || brands.toLowerCase().includes(lowerQuery);
          });
          if (products.length === 0) {
            this._switchMode('search');
            return;
          }
        }
      } else if (this.viewMode === 'favorites') {
        const favorites = await this.db.getFavorites();
        const promises = favorites.map(async (fav) => {
          return await this.db.getCachedProduct(fav.code);
        });
        const results = await Promise.all(promises);
        const cachedProducts = results.filter(p => !!p);

        const allMeals = await this.db.getAllMeals();
        const favoriteMeals = allMeals.filter(m => favorites.some(f => f.code === m.id));
        const mealItems = favoriteMeals.map(m => ({
          code: m.id,
          product_name: m.name,
          isMeal: true,
          nutriments: {
            'energy-kcal': m.foods.reduce((acc, f) => acc + (f.product.nutriments?.['energy-kcal'] || 0) * (f.quantity / 100), 0)
          } as any,
        }));

        products = [...cachedProducts, ...mealItems];

        if (products && products.length > 0 && this.query) {
          products = products.filter(p => {
            const name = p.product_name || p.product?.product_name || '';
            const brands = p.brands || p.product?.brands || '';
            const lowerQuery = this.query.toLowerCase();
            return name.toLowerCase().includes(lowerQuery) || brands.toLowerCase().includes(lowerQuery);
          });
          if (products.length === 0) {
            this._switchMode('search');
            return;
          }
        }
      } else if (this.viewMode === 'search') {
        if (this.query) {
          const isBarcode = /^\d{8,14}$/.test(this.query);
          if (isBarcode) {
            const productResponse = await this.api.getProduct(this.query);
            if (productResponse && productResponse.status === 'success' && productResponse.product) {
              const params = this.getQueryParamsURL();
              const mealId = params.get('mealId');
              const navParams: any = { page: 'food', code: this.query };
              if (mealId) {
                navParams.mealId = mealId;
              }
              this.triggerPageNavigation(navParams);
              return;
            }
          }

          const searchResponse = await this.api.searchProduct(this.query);
          const rawProducts = searchResponse.products || [];

          products = await Promise.all(rawProducts.map(async (p: any) => {
            const cached = await this.db.getCachedProduct(p.code);
            return cached || p;
          }));

        } else {
          products = [];
        }
      } else if (this.viewMode === 'meals') {
        let meals = await this.db.getAllMeals();

        if (this.query) {
          const lowerQuery = this.query.toLowerCase();
          meals = meals.filter(m => m.name.toLowerCase().includes(lowerQuery));
        }

        products = meals.map(m => ({
          code: m.id,
          url: '',
          product_name: m.name,
          isMeal: true,
          nutriments: {
            'energy-kcal': m.foods.reduce((acc, f) => acc + (f.product.nutriments?.['energy-kcal'] || 0) * (f.quantity / 100), 0)
          } as any,
        }));
      }

      this.searchResult = await Promise.all(products.map(async product => {
        const isFavorite = await this.db.isFavorite(product.code);
        if (product.isMeal) return { ...product, isFavorite };

        const normalized: any = { ...product, isFavorite };
        if (product.product) {
          normalized.product_name = product.product.product_name || normalized.product_name;
          normalized.nutriments = product.product.nutriments || normalized.nutriments;
          normalized.brands = product.product.brands || normalized.brands;
        }
        return normalized;
      }));

    } catch (e) {
      console.error('Error loading data', e);
      this.searchResult = [];
    } finally {
      this.loading = false;
    }
  }

  private _generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async _handleSearchInit(e: CustomEvent) {
    const { query, isButtonClick } = e.detail;
    this.query = query;

    if (isButtonClick) {
      this._switchMode('search');
    } else {
      this._loadData();
    }
  }

  private _handleSearchBlur(e: CustomEvent) {
    this.query = e.detail.query;
    this._loadData();
  }

  private _handleModeSwitch(e: CustomEvent) {
    this._switchMode(e.detail.id);
  }

  private _switchMode(mode: 'cached' | 'favorites' | 'search' | 'meals') {
    this.viewMode = mode;
    this.groupButtonOptions = this.groupButtonOptions.map(opt => ({
      ...opt,
      active: opt.id === mode
    }));
    this._loadData();
  }

  private async _handleFavoriteClick(e: CustomEvent) {
    if (e.detail?.code) {
      const product = this.searchResult.find(product => product.code === e.detail.code);
      if (product) {
        product.isFavorite = e.detail.value === 'true';
        this.requestUpdate();

        if (product.isFavorite) {
          try {
            if (!(product as any).isMeal) {
              const fullProduct = await this.api.getProduct(e.detail.code);
              if (fullProduct) {
                await this.db.cacheProduct(fullProduct);
              }
            }
            await this.db.addFavorite(e.detail.code);
          } catch (err) {
            console.error('Error adding favorite', err);
          }
        } else {
          await this.db.removeFavorite(e.detail.code);
        }
      }
    }
  }

  private _handleElementClick(e: CustomEvent) {
    if (e.detail?.code) {
      if (this.viewMode === 'meals' || (this.searchResult.find(p => p.code === e.detail.code) as any)?.isMeal) {
        this.triggerPageNavigation({ page: 'meal', mealId: e.detail.code });
      } else {
        const params = this.getQueryParamsURL();
        const mealId = params.get('mealId');
        const navParams: any = { page: 'food', code: e.detail.code };
        if (mealId) {
          navParams.mealId = mealId;
        }
        this.triggerPageNavigation(navParams);
      }
    }
  }

  render() {
    return html`
      <div class="page-container">
        <h1>${this.mealId ? this.translations.addFood : this.translations.searchProduct}</h1>
        <div class="search-container">
          <component-search-input 
            placeholder="${this.translations.searchProductplacholder}" 
            search-button-text="${this.translations.search}" 
            @search-init="${this._handleSearchInit}"
            @search-blur="${this._handleSearchBlur}"
          ></component-search-input>
          <button class="scan-btn" @click="${() => this.triggerPageNavigation({ page: 'scanner' })}">
            <svg width="800px" height="35px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="color:inherit">
              <title>ionicons-v5-d</title>
              <polyline points="400 400.33 448 400 448 112 400 112.33" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <polyline points="112 112 64 112.33 64 400.33 112 400" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="384" y1="192" x2="384" y2="320" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="320" y1="160" x2="320" y2="352" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="256" y1="176" x2="256" y2="336" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="192" y1="160" x2="192" y2="352" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="128" y1="192" x2="128" y2="320" style="fill:none;stroke:currentColor;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
            </svg>
          </button>
        </div>
        
        <div class="group-button-wrapper">
             <component-group-button
                .options="${this.groupButtonOptions}"
                @group-button-click="${this._handleModeSwitch}"
             ></component-group-button>
        </div>

        ${this.viewMode === 'meals' ? html`
          <button class="btn btn-create" @click="${() => this.triggerPageNavigation({ page: 'meal', mealId: this._generateId() })}">
              ${this.translations.createNewMeal}
          </button>
        ` : html``}

        <div class="search-result-container">
        ${this.loading ? html`
          <component-spinner class="loading-spinner"></component-spinner>
        ` : html`
          ${this.searchResult.length > 0 ? html`
            ${this.viewMode === 'search' ? html`
              <button class="btn btn-create" @click="${() => this.triggerPageNavigation({ page: 'food', code: this._generateId(), query: this.query })}">
                ${this.translations.createNewProduct}
              </button>
            ` : ''}
            <div>
              ${this.searchResult.map(product => html`
                <component-search-result 
                  name="${product.product_name}" 
                  code="${product.code}" 
                  brands="${product.brands || ''}"
                  calories="${product.nutriments && product.nutriments['energy-kcal'] ? product.nutriments['energy-kcal'] : -1}" 
                  favorite="${product.isFavorite}"
                  @favorite-click="${this._handleFavoriteClick}"
                  @element-click="${this._handleElementClick}"
                ></component-search-result>
              `)}
            </div>
          ` : ''}
          ${this.searchResult.length === 0 && this.query.length > 0 ? html`
            <p>${this.translations.noResultsFound}</p>
            ${this.viewMode === 'search' ? html`
              <button class="btn btn-create" @click="${() => this.triggerPageNavigation({ page: 'food', code: this._generateId(), query: this.query })}">
                ${this.translations.createNewProduct}
              </button>
            ` : ''}

          ` : ''}
        `}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-search': PageSearch;
  }
}
