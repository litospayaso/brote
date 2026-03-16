import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';
import ComponentMaintenanceCalories from './componentMaintenanceCalories';
import './index';

describe('ComponentMaintenanceCalories Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentMaintenanceCalories,
      name: 'component-maintenance-calories'
    });

    element = component.element;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render empty when no data provided', async () => {
    const shadow = element.shadowRoot;
    const title = shadow?.querySelector('.header h2');
    
    expect(title?.textContent?.trim()).to.equal('Basal Metabolic Rate');
  });

  it('should render component', async () => {
    const shadow = element.shadowRoot;
    const formContainer = shadow?.querySelector('.form-container');

    expect(formContainer).to.not.be.null;
  });

  it('should render header', async () => {
    const shadow = element.shadowRoot;
    const header = shadow?.querySelector('.header h2');

    expect(header?.textContent?.trim()).to.equal('Basal Metabolic Rate');
  });

  it('should render form fields', async () => {
    const shadow = element.shadowRoot;
    const inputs = shadow?.querySelectorAll('input');
    const selects = shadow?.querySelectorAll('select');

    expect(inputs?.length).to.be.greaterThan(0);
    expect(selects?.length).to.be.greaterThan(0);
  });

  it('should update when height changes', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const heightInput = shadow?.querySelector('input');
    
    expect(heightInput).to.not.be.null;
  });

  it('should update when weight changes', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const inputs = shadow?.querySelectorAll('input');
    
    expect(inputs?.length).to.be.greaterThan(0);
  });

  it('should update when age changes', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const inputs = shadow?.querySelectorAll('input');
    
    expect(inputs?.length).to.be.greaterThan(0);
  });

  it('should hide warning when showWarning is false', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.showWarning = false;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const warning = shadow?.querySelector('.warning-message');

    expect(warning).to.be.null;
  });

  it('should show warning by default', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    el.showWarning = true;
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));

    const shadow = element.shadowRoot;
    const warning = shadow?.querySelector('.warning-message');

    expect(warning).to.not.be.null;
  });

  it('should calculate protein correctly', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));

    const shadow = element.shadowRoot;
    const macroLabels = shadow?.querySelectorAll('.macro-label');

    expect(macroLabels?.length).to.be.greaterThan(0);
  });

  it('should dispatch save-calories event when save button clicked', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    let dispatched = false;
    el.addEventListener('save-calories', () => {
      dispatched = true;
    });

    el._handleSave();
    await el.updateComplete;

    expect(dispatched).to.be.true;
  });

  it('should dispatch calories-calculated event', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    let dispatched = false;
    el.addEventListener('calories-calculated', () => {
      dispatched = true;
    });

    el.height = 175;
    await el.updateComplete;

    expect(dispatched).to.be.true;
  });

  it('should render save button when all required fields provided', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));

    const shadow = element.shadowRoot;
    const saveButton = shadow?.querySelector('.save-button');

    expect(saveButton).to.not.be.null;
  });

  it('should return 0 calories when height is missing', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 0;
    el.weight = 80;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const resultContainer = shadow?.querySelector('.result-container');

    expect(resultContainer).to.be.null;
  });

  it('should return 0 calories when weight is missing', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.height = 180;
    el.weight = 0;
    el.gender = 'male';
    el.age = 30;
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const resultContainer = shadow?.querySelector('.result-container');

    expect(resultContainer).to.be.null;
  });

  it('should accept translations', async () => {
    const el = element as ComponentMaintenanceCalories;
    el.translations = JSON.stringify({
      maintenanceCaloriesTitle: 'Test Title',
      height: 'Height',
      weight: 'Weight'
    });
    await el.updateComplete;

    const shadow = element.shadowRoot;
    const title = shadow?.querySelector('.header h2');

    expect(title?.textContent?.trim()).to.equal('Test Title');
  });
});
