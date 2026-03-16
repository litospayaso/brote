import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';
import ComponentDayTip from './componentDayTip';
import './index';

describe('ComponentDayTip Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentDayTip,
      name: 'component-day-tip'
    });

    element = component.element;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render a tip in English by default', async () => {
    const shadow = element.shadowRoot;
    const title = shadow?.querySelector('.tip-title');
    const text = shadow?.querySelector('.tip-text');

    expect(title?.textContent?.trim()).to.equal('Tip of the day');
    expect(text?.textContent?.trim()).to.not.be.empty;
  });

  it('should update tip when language changes', async () => {
    const el = element as ComponentDayTip;
    el.language = 'es';
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const title = shadow?.querySelector('.tip-title');

    expect(title?.textContent?.trim()).to.equal('Consejo del día');
  });

});
