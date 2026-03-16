import PageFood from './pageFood';
import { accessibilityCheck, createComponent, defer, waitForElement } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

const mockProductData = {
  code: '123',
  product: {
    product_name: 'Test Food',
    nutriments: {
      'energy-kcal_100g': 100,
      carbohydrates_100g: 10,
      proteins_100g: 5,
      fat_100g: 2
    }
  }
};

const api = {
  getProduct: () => Promise.resolve(mockProductData),
};

describe('PageFood Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageFood,
      name: 'page-food',
      api,
      route: '?code=123'
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

  it('should display product name', (done) => {
    waitForElement(() => shadow.querySelector('h1.product-name-title')).then(() => {
      const header = shadow.querySelector('h1.product-name-title');
      expect(header).to.exist;
      expect(header?.textContent).to.include('Test Food');
      done();
    });
  });

  it('should display initial nutrients for 100g', (done) => {
    waitForElement(() => shadow.querySelector('.nutrient-value')).then(() => {
      const values = shadow.querySelectorAll('.nutrient-value');
      expect(values[0].textContent.trim()).to.equal('100.0');
      expect(values[1].textContent.trim()).to.equal('10.0');
      done();
    });
  });

  it('should update nutrients when input changes to 200g', (done) => {
    waitForElement(() => shadow.querySelector('input')).then(() => {
      const input: HTMLInputElement = shadow.querySelector('input') as HTMLInputElement;
      input.value = '200';
      input.dispatchEvent(new Event('input'));
      defer(() => {
        const values = shadow.querySelectorAll('.nutrient-value');
        expect(values[0].textContent.trim()).to.equal('200.0');
        expect(values[1].textContent.trim()).to.equal('20.0');
        done();
      });
    });
  });

  it('should toggle favorite state when button is clicked', (done) => {
    waitForElement(() => shadow.querySelector('button')).then(() => {
      const isFavorite = shadow.querySelector('.favorite-icon')?.classList.contains('is-favorite');
      const button = shadow.querySelector('button');
      expect(button).to.exist;
      button?.click();

      defer(() => {
        const favoriteChanged = shadow.querySelector('.favorite-icon')?.classList.contains('is-favorite');
        expect(favoriteChanged).to.not.be.equal(isFavorite);
        done();
      });
    });
  });

  it('should display pie chart', (done) => {
    waitForElement(() => shadow.querySelector('component-pie-chart')).then(() => {
      const pieChart = shadow.querySelector('component-pie-chart');
      expect(pieChart).to.exist;
      done();
    });
  });
});

xdescribe('PageFood Component Error/Loading Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageFood,
      name: 'page-food',
      api: { getProduct: () => Promise.resolve(null) },
    });

    shadow = component.shadow;
    element = component.element;
  });


  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should show error message when no code provided', (done) => {
    waitForElement(() => shadow.querySelector('.error-message')).then(() => {
      const error = shadow.querySelector('.error-message');
      expect(error).to.exist;
      expect(error?.textContent).to.include('No product code provided');
      done();
    });
  });

});

xdescribe('PageFood Component Error/Loading Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageFood,
      name: 'page-food',
      api: { getProduct: () => Promise.reject(new Error('Product not found')) },
      route: '?code=999'
    });

    shadow = component.shadow;
    element = component.element;
  });


  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should show empty product in edit mode when product not found', (done) => {
    waitForElement(() => shadow.querySelector('input.name-input')).then(() => {
      const input = shadow.querySelector('input.name-input') as HTMLInputElement;
      expect(input).to.exist;
      expect(input.value).to.equal('New Product');
      done();
    });
  });
});

