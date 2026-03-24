import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';
import ComponentUserStatus from './componentUserStatus';
import './index';

describe('ComponentUserStatus Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentUserStatus,
      name: 'component-user-status'
    });

    element = component.element;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render empty if it has no values', async () => {
    const shadow = element.shadowRoot;
    const values = Array.from(shadow?.querySelectorAll('.value') || []);

    expect(values.length).to.equal(0);
  });

  it('should update and render provided properties', async () => {
    const el = element as ComponentUserStatus;
    el.exerciseCalories = 100;
    el.basalCalories = 1500;
    el.steps = 5000;
    el.sleepHours = 8;
    el.energyLevel = 5;

    await el.updateComplete;

    const shadow = element.shadowRoot;
    const values = Array.from(shadow?.querySelectorAll('.value') || []);

    expect(values[0].textContent?.trim()).to.equal('1500');
    expect(values[1].textContent?.trim()).to.equal('100');
    expect(values[2].textContent?.trim()).to.equal('5000');
    expect(values[3].textContent?.trim()).to.equal('8:00');
    expect(values[4].textContent?.trim()).to.equal('5/10');
  });

  it('should open modal on click', async () => {
    const card = element.shadowRoot?.querySelector('.status-card') as HTMLElement;
    card.click();
    await (element as ComponentUserStatus).updateComplete;

    const modal = element.shadowRoot?.querySelector('.modal-overlay');
    expect(modal).to.exist;
  });

  it('should dispatch status-changed event on save', async () => {
    const el = element as ComponentUserStatus;
    el.exerciseCalories = 100;
    el.basalCalories = 1500;
    el.steps = 5000;
    el.sleepHours = 8;
    el.energyLevel = 5;

    (element.shadowRoot?.querySelector('.status-card') as HTMLElement).click();
    await el.updateComplete;

    (el as any)._exerciseCalories = 200;

    const promise = new Promise<CustomEvent>((resolve) => {
      element.addEventListener('status-changed', (e) => resolve(e as CustomEvent), { once: true });
    });

    (element.shadowRoot?.querySelector('.modal-buttons .btn') as HTMLElement).click();

    const event = await promise;
    expect(event.detail.exerciseCalories).to.equal(200);
    expect(el.exerciseCalories).to.equal(200);
  });

  it('should have a status-card with rounded borders', async () => {
    const shadow = element.shadowRoot;
    const card = shadow?.querySelector('.status-card');
    expect(card).to.exist;

    const style = window.getComputedStyle(card!);
    expect(style.borderRadius).to.equal('8px');
  });

  it('should render all five activity items', async () => {
    const shadow = element.shadowRoot;
    const items = shadow?.querySelectorAll('.status-item');
    expect(items?.length).to.equal(6);
  });

  it('should show 📝 icon when thoughts are present', async () => {
    const el = element as ComponentUserStatus;
    el.thoughts = 'Taking a break today';
    await el.updateComplete;

    const icon = element.shadowRoot?.querySelector('.thoughts-icon');
    expect(icon).to.exist;
    expect(icon?.getAttribute('title')).to.equal('Taking a break today');
  });

  it('should update thoughts via modal', async () => {
    const el = element as ComponentUserStatus;

    (element.shadowRoot?.querySelector('.status-card') as HTMLElement).click();
    await el.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).to.exist;

    textarea.value = 'New thoughts';
    textarea.dispatchEvent(new Event('input'));

    const promise = new Promise<CustomEvent>((resolve) => {
      element.addEventListener('status-changed', (e) => resolve(e as CustomEvent), { once: true });
    });

    (element.shadowRoot?.querySelector('.modal-buttons .btn') as HTMLElement).click();

    const event = await promise;
    expect(event.detail.thoughts).to.equal('New thoughts');
    expect(el.thoughts).to.equal('New thoughts');
  });
});
