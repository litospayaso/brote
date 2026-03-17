import PageSearch from './pageSearch';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

const mockApi = {
  searchProduct: () => Promise.resolve({ products: [{ code: '12345', product_name: 'Test Product' }] }),
  getProduct: () => Promise.resolve({ product: { product_name: 'Full Product', code: '12345', nutriments: {} }, code: '12345' }),
};

describe('SearchPage Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search',
      api: mockApi,
      db: {
        init: () => Promise.resolve(),
        getAllCachedProducts: () => Promise.resolve([]),
        getFavorites: () => Promise.resolve([]),
        getCachedProduct: () => Promise.resolve(undefined),
        isFavorite: () => Promise.resolve(false),
        addFavorite: () => Promise.resolve(),
        removeFavorite: () => Promise.resolve()
      }
    });

    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should contain shadow root', () => {
    expect(shadow).to.not.be.undefined;
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.lessThan(5);
  });

  it('should display the product when search is initiated', async () => {
    const searchInput = shadow.querySelector('component-search-input');
    expect(searchInput).to.exist;

    searchInput?.dispatchEvent(new CustomEvent('search-init', {
      detail: { query: 'test', isButtonClick: true },
      bubbles: true,
      composed: true
    }));

    await new Promise(resolve => setTimeout(resolve, 100));

    const resultItem = shadow.querySelector('component-search-result');
    expect(resultItem).to.exist;
    expect(resultItem?.getAttribute('name')).to.include('Test Product');
  });

  it('should switch mode when group button is clicked', async () => {
    (element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([{ product_name: 'Cached Product', code: '123' }]),
      getFavorites: () => Promise.resolve([{ code: '456' }]),
      getCachedProduct: (_code: string) => Promise.resolve({ product_name: 'Favorite Product', code: '456' }),
      isFavorite: () => Promise.resolve(false)
    };

    await (element as any).onPageInit();
    await (element as any).updateComplete;

    const groupButton = shadow.querySelector('component-group-button');
    expect(groupButton).to.exist;

    groupButton?.dispatchEvent(new CustomEvent('group-button-click', { detail: { id: 'favorites' } }));
    await (element as any).updateComplete;
    await new Promise(r => setTimeout(r, 0));
    await (element as any).updateComplete;

    expect((element as any).viewMode).to.equal('favorites');
  });

  it('should filter cached products on blur', async () => {
    (element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([
        { product_name: 'Apple', code: '1' },
        { product_name: 'Banana', code: '2' }
      ]),
      isFavorite: () => Promise.resolve(false)
    };

    await (element as any).onPageInit();
    await (element as any).updateComplete;

    const input = shadow.querySelector('component-search-input');
    input?.dispatchEvent(new CustomEvent('search-blur', { detail: { query: 'App' } }));

    await new Promise(r => setTimeout(r, 0));
    await (element as any).updateComplete;

    const results = shadow.querySelectorAll('component-search-result');
    expect(results.length).to.equal(1);
    expect(results[0].getAttribute('name')).to.equal('Apple');
  });

  it('should fetch and cache product when adding to favorites', async () => {
    let getProductCalled = false;
    let cacheProductCalled = false;
    let addFavoriteCalled = false;

    const customApi = {
      ...mockApi,
      searchProduct: () => Promise.resolve({ products: [{ code: '999', product_name: 'New Product' }] }),
      getProduct: () => {
        getProductCalled = true;
        return Promise.resolve({ product: { product_name: 'New Product Full', code: '999' }, code: '999' });
      }
    };

    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-fav',
      api: customApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false),
      cacheProduct: () => {
        cacheProductCalled = true;
        return Promise.resolve();
      },
      addFavorite: () => {
        addFavoriteCalled = true;
        return Promise.resolve();
      },
      removeFavorite: () => Promise.resolve()
    };

    const element = component.element;
    const shadow = component.shadow;

    await (element as any).onPageInit();
    await (element as any).updateComplete;

    const input = shadow.querySelector('component-search-input');
    input?.dispatchEvent(new CustomEvent('search-init', {
      detail: { query: 'New', isButtonClick: true },
      bubbles: true,
      composed: true
    }));
    await (element as any).updateComplete;
    await new Promise(r => setTimeout(r, 0));
    await (element as any).updateComplete;

    const result = shadow.querySelector('component-search-result');
    expect(result).to.exist;

    result?.dispatchEvent(new CustomEvent('favorite-click', {
      detail: { code: '999', value: 'true' },
      bubbles: true,
      composed: true
    }));

    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 50));

    expect(getProductCalled).to.be.true;
    expect(cacheProductCalled).to.be.true;
    expect(addFavoriteCalled).to.be.true;

    document.body.removeChild(element);
  });

  it('should handle swipe to navigate from cached to home', async () => {
    let navigated = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'home') {
        navigated = true;
      }
    };

    (element as any).viewMode = 'cached';
    (element as any).handleSwipe(10);
    await (element as any).updateComplete;
    
    expect(navigated).to.be.true;
  });

  it('should handle swipe to switch from cached to favorites', async () => {
    (element as any).viewMode = 'cached';
    (element as any).handleSwipe(-10);
    await (element as any).updateComplete;
    
    expect((element as any).viewMode).to.equal('favorites');
  });

  it('should handle swipe from favorites to cached', async () => {
    (element as any).viewMode = 'favorites';
    (element as any).handleSwipe(10);
    
    expect((element as any).viewMode).to.equal('cached');
  });

  it('should handle swipe from favorites to search', async () => {
    (element as any).viewMode = 'favorites';
    (element as any).handleSwipe(-10);
    
    expect((element as any).viewMode).to.equal('search');
  });

  it('should handle swipe from search to favorites', async () => {
    (element as any).viewMode = 'search';
    (element as any).handleSwipe(10);
    
    expect((element as any).viewMode).to.equal('favorites');
  });

  it('should handle swipe from search to meals', async () => {
    (element as any).viewMode = 'search';
    (element as any).handleSwipe(-10);
    
    expect((element as any).viewMode).to.equal('meals');
  });

  it('should handle swipe from meals to user', async () => {
    let navigated = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'user') {
        navigated = true;
      }
    };

    (element as any).viewMode = 'meals';
    (element as any).handleSwipe(-10);
    
    expect(navigated).to.be.true;
  });

  it('should handle swipe from meals to search', async () => {
    (element as any).viewMode = 'meals';
    (element as any).handleSwipe(10);
    
    expect((element as any).viewMode).to.equal('search');
  });

  it('should load meals data in meals view mode', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-meals',
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllMeals: () => Promise.resolve([
        { 
          id: 'meal1', 
          name: 'Breakfast', 
          foods: [
            { product: { nutriments: { 'energy-kcal': 100 } }, quantity: 100 }
          ]
        }
      ]),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;
    const sh = component.shadow;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).viewMode = 'meals';
    await (el as any)._loadData();
    await (el as any).updateComplete;

    const results = sh.querySelectorAll('component-search-result');
    expect(results.length).to.be.greaterThan(0);

    document.body.removeChild(el);
  });

  it('should filter meals by query', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-meals-filter',
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllMeals: () => Promise.resolve([
        { id: 'meal1', name: 'Breakfast', foods: [] },
        { id: 'meal2', name: 'Lunch', foods: [] }
      ]),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;
    const sh = component.shadow;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).viewMode = 'meals';
    (el as any).query = 'break';
    await (el as any)._loadData();
    await (el as any).updateComplete;

    const results = sh.querySelectorAll('component-search-result');
    expect(results.length).to.equal(1);
    expect(results[0].getAttribute('name')).to.equal('Breakfast');

    document.body.removeChild(el);
  });

  it('should search by barcode and navigate to food page', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-barcode',
      api: {
        ...mockApi,
        getProduct: () => Promise.resolve({ status: 'success', product: { product_name: 'Barcode Product' }, code: '12345678' })
      }
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    let navigated = false;
    (component.element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'food' && params.code === '12345678') {
        navigated = true;
      }
    };

    const el = component.element;
    const sh = component.shadow;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    const input = sh.querySelector('component-search-input');
    input?.dispatchEvent(new CustomEvent('search-init', {
      detail: { query: '12345678', isButtonClick: true },
      bubbles: true,
      composed: true
    }));

    await new Promise(r => setTimeout(r, 100));
    await (el as any).updateComplete;

    expect(navigated).to.be.true;

    document.body.removeChild(el);
  });

  it('should show empty results message when no products found', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-empty',
      api: {
        ...mockApi,
        searchProduct: () => Promise.resolve({ products: [] })
      }
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;
    const sh = component.shadow;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).viewMode = 'search';
    (el as any).query = 'nonexistent';
    await (el as any)._loadData();
    await (el as any).updateComplete;

    const noResults = sh.querySelector('p');
    expect(noResults?.textContent).to.include('No results found');

    document.body.removeChild(el);
  });

  it('should handle favorite click to remove favorite', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-remove-fav',
      api: mockApi
    });

    let removeFavoriteCalled = false;

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(true),
      addFavorite: () => Promise.resolve(),
      removeFavorite: () => {
        removeFavoriteCalled = true;
        return Promise.resolve();
      }
    };

    const el = component.element;
    const sh = component.shadow;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).searchResult = [{ code: '123', product_name: 'Test', isFavorite: true }];
    await (el as any).updateComplete;

    const result = sh.querySelector('component-search-result');
    result?.dispatchEvent(new CustomEvent('favorite-click', {
      detail: { code: '123', value: 'false' },
      bubbles: true,
      composed: true
    }));

    await new Promise(r => setTimeout(r, 50));

    expect(removeFavoriteCalled).to.be.true;

    document.body.removeChild(el);
  });

  it('should navigate to scanner when scan button clicked', async () => {
    let navigated = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'scanner') {
        navigated = true;
      }
    };

    const scanButton = shadow.querySelector('button.scan-btn') as HTMLButtonElement;
    scanButton?.click();

    expect(navigated).to.be.true;
  });

  it('should handle element click to navigate to food page', async () => {
    let navigated = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'food' && params.code === '123') {
        navigated = true;
      }
    };

    (element as any).viewMode = 'search';
    (element as any).searchResult = [{ code: '123', product_name: 'Test Product' }];
    await (element as any).updateComplete;

    const result = shadow.querySelector('component-search-result');
    result?.dispatchEvent(new CustomEvent('element-click', {
      detail: { code: '123' },
      bubbles: true,
      composed: true
    }));

    expect(navigated).to.be.true;
  });

  it('should handle element click in meals mode to navigate to meal page', async () => {
    let navigated = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'meal' && params.mealId === 'meal123') {
        navigated = true;
      }
    };

    (element as any).viewMode = 'meals';
    (element as any).searchResult = [{ code: 'meal123', product_name: 'Test Meal', isMeal: true }];
    await (element as any).updateComplete;

    const result = shadow.querySelector('component-search-result');
    result?.dispatchEvent(new CustomEvent('element-click', {
      detail: { code: 'meal123' },
      bubbles: true,
      composed: true
    }));

    expect(navigated).to.be.true;
  });

  it('should load favorites with meals', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-fav-meals',
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([{ code: 'fav1' }]),
      getCachedProduct: () => Promise.resolve(null),
      getAllMeals: () => Promise.resolve([
        { id: 'fav1', name: 'Favorite Meal', foods: [] }
      ]),
      isFavorite: () => Promise.resolve(true)
    };

    const el = component.element;
    
    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).viewMode = 'favorites';
    await (el as any)._loadData();
    await (el as any).updateComplete;

    expect((el as any).searchResult.length).to.be.greaterThan(0);

    document.body.removeChild(el);
  });

  it('should switch to search when cached products filtered to zero', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-filter-empty',
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([{ product_name: 'Apple', code: '1' }]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;
    
    await (el as any).onPageInit();
    await (el as any).updateComplete;

    (el as any).viewMode = 'cached';
    (el as any).query = 'nonexistent';
    await (el as any)._loadData();
    await (el as any).updateComplete;

    expect((el as any).viewMode).to.equal('search');

    document.body.removeChild(el);
  });

  it('should render create new product button in search mode with results', async () => {
    (element as any).viewMode = 'search';
    (element as any).searchResult = [{ code: '123', product_name: 'Test' }];
    await (element as any).updateComplete;

    const createButton = shadow.querySelector('.btn-create');
    expect(createButton).to.exist;
  });

  it('should render create new meal button in meals mode', async () => {
    (element as any).viewMode = 'meals';
    await (element as any).updateComplete;

    const createButton = shadow.querySelector('.btn-create');
    expect(createButton).to.exist;
  });

  it('should render create new product button when no results', async () => {
    (element as any).viewMode = 'search';
    (element as any).query = 'test';
    (element as any).searchResult = [];
    await (element as any).updateComplete;

    const createButton = shadow.querySelector('.btn-create');
    expect(createButton).to.exist;
  });

  it('should show loading spinner when loading', async () => {
    (element as any).loading = true;
    await (element as any).updateComplete;

    const spinner = shadow.querySelector('component-spinner');
    expect(spinner).to.exist;
  });

  it('should navigate with mealId when clicking on product', async () => {
    let navigatedWithMealId = false;
    (element as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'food' && params.code === '123' && params.mealId === 'meal456') {
        navigatedWithMealId = true;
      }
    };

    const originalGetQueryParamsURL = (element as any).getQueryParamsURL;
    (element as any).getQueryParamsURL = () => new Map([['mealId', 'meal456']]);

    (element as any).viewMode = 'search';
    (element as any).searchResult = [{ code: '123', product_name: 'Test Product' }];
    await (element as any).updateComplete;

    const result = shadow.querySelector('component-search-result');
    result?.dispatchEvent(new CustomEvent('element-click', {
      detail: { code: '123' },
      bubbles: true,
      composed: true
    }));

    expect(navigatedWithMealId).to.be.true;

    (element as any).getQueryParamsURL = originalGetQueryParamsURL;
  });

  it('should initialize with meals button when no mealId', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-no-mealid',
      api: mockApi,
      route: ''
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([{ product_name: 'Product', code: '1' }]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    expect((el as any).groupButtonOptions.length).to.equal(4);

    document.body.removeChild(el);
  });

  it('should initialize without meals button when mealId is present', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-with-mealid',
      api: mockApi,
      route: '?mealId=123'
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([{ product_name: 'Product', code: '1' }]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    expect((el as any).groupButtonOptions.length).to.equal(3);
    expect((el as any).mealId).to.equal('123');

    document.body.removeChild(el);
  });

  it('should start in search mode when no cached products', async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search-no-cache',
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false)
    };

    const el = component.element;

    await (el as any).onPageInit();
    await (el as any).updateComplete;

    expect((el as any).viewMode).to.equal('search');

    document.body.removeChild(el);
  });
});
