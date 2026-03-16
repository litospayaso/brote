import { expect } from '@esm-bundle/chai';
import { accessibilityCheck, createComponent } from '../../shared/test-helper';

import './index'; // This should import the component definition
import PageHome from './pageHome';

describe('PageHome Component Spec:', () => {
  let element: HTMLElement;
  // let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home'
    });
    // shadow = component.shadow;
    element = component.element;
  });

  it('should contain shadow root', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.lessThan(5);
  });

  it('should render summary cards with correct classes', async () => {
    const summaryCards = element.shadowRoot?.querySelectorAll('.summary-card');
    expect(summaryCards?.length).to.equal(4);

    const caloriesCard = element.shadowRoot?.querySelector('.summary-card.calories');
    expect(caloriesCard).to.exist;

    const carbsCard = element.shadowRoot?.querySelector('.summary-card.carbs');
    expect(carbsCard).to.exist;

    const fatCard = element.shadowRoot?.querySelector('.summary-card.fat');
    expect(fatCard).to.exist;

    const proteinCard = element.shadowRoot?.querySelector('.summary-card.protein');
    expect(proteinCard).to.exist;
  });
});
