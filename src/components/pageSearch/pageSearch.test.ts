import PageSearch from './pageSearch';
import { accessibilityCheck, createComponent } from '../../shared/test-helper';
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
      api: mockApi
    });

    (component.element as any).db = {
      init: () => Promise.resolve(),
      getAllCachedProducts: () => Promise.resolve([]),
      getFavorites: () => Promise.resolve([]),
      getCachedProduct: () => Promise.resolve(null),
      isFavorite: () => Promise.resolve(false),
      addFavorite: () => Promise.resolve(),
      removeFavorite: () => Promise.resolve()
    };

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
});
