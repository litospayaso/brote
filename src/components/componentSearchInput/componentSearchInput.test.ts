import { ComponentSearchInput } from './componentSearchInput';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('SearchInput Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;
  let searchInitEvent: CustomEvent;
  let searchBlurEvent: CustomEvent;
  let callCount: number = 0;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentSearchInput,
      name: 'component-search-input',
      listeners: {
        'search-init': (e: CustomEvent) => {
          searchInitEvent = e;
        },
        'search-blur': (e: CustomEvent) => {
          searchBlurEvent = e;
          callCount++;
        },
      }
    });

    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    document.body.removeChild(element);
    searchInitEvent = undefined as unknown as CustomEvent;
    searchBlurEvent = undefined as unknown as CustomEvent;
    callCount = 0;
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should contain shadow root', () => {
    expect(shadow).to.not.be.undefined;
  });

  it('should initialize with default properties', () => {
    const searchInput = element as ComponentSearchInput;
    expect(searchInput.value).to.equal('');
    expect(searchInput.placeholder).to.equal('');
  });

  it('should reflect properties to attributes/DOM', (done) => {
    element.setAttribute('value', 'Test Value');
    element.setAttribute('placeholder', 'Search here...');

    defer(() => {
      const input = shadow.querySelector('input');
      expect(input?.value).to.equal('Test Value');
      expect(input?.placeholder).to.equal('Search here...');
      done();
    });

  });

  it('should update value property on input', () => {
    const input = shadow.querySelector('input')!;
    input.value = 'New Value';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect((element as ComponentSearchInput).value).to.equal('New Value');
  });

  it('should dispatch search-init event on blur if value changed', (done) => {
    const input = shadow.querySelector('input')!;
    input.value = 'Search Term';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));

    defer(() => {
      expect(searchBlurEvent?.detail.query).to.equal('Search Term');
      done();
    });
  });

  it('should not dispatch search-init if value has not changed', (done) => {
    const input = shadow.querySelector('input')!;

    input.value = 'Same Value';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('blur'));

    defer(() => {
      expect(callCount).to.equal(1);

      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      defer(() => {
        expect(callCount).to.equal(1);
        done();
      });
    });
  });
});
