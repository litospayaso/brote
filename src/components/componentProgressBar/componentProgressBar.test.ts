import { ComponentProgressBar } from './componentProgressBar';
import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';
import { translations } from '../../shared/translations';

describe('ComponentProgressBar Spec:', () => {
  let element: HTMLElement;
  let componentInstance: ComponentProgressBar;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentProgressBar,
      name: 'component-progress-bar'
    });

    element = component.element;
    componentInstance = element as ComponentProgressBar;
    componentInstance.translations = JSON.stringify(translations.en);
    await componentInstance.updateComplete;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render with default values', async () => {
    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('0 / 0 kcal eated');
  });

  it('should display correct calorie counts', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    componentInstance.caloriesEaten = 1500;
    await componentInstance.updateComplete;

    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('1500 / 2000 kcal eated');
  });

  it('should calculate segment widths correctly', async () => {
    componentInstance.dailyCaloriesGoal = 1000;
    componentInstance.caloriesEaten = 500;
    componentInstance.fatEaten = 20;
    componentInstance.carbsEaten = 50;
    componentInstance.proteinEaten = 30;

    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;

    const fatSegment = shadow?.querySelector('.segment.fat') as HTMLElement;
    const carbsSegment = shadow?.querySelector('.segment.carbs') as HTMLElement;
    const proteinSegment = shadow?.querySelector('.segment.protein') as HTMLElement;

    const fatWidth = parseFloat(fatSegment.style.width);
    const carbsWidth = parseFloat(carbsSegment.style.width);
    const proteinWidth = parseFloat(proteinSegment.style.width);

    expect(fatWidth).to.be.closeTo(18, 0.1);
    expect(carbsWidth).to.be.closeTo(20, 0.1);
    expect(proteinWidth).to.be.closeTo(12, 0.1);
    expect(fatWidth + carbsWidth + proteinWidth).to.be.closeTo(50, 0.1);
  });

  it('should update when properties change', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    await componentInstance.updateComplete;

    componentInstance.caloriesEaten = 200;
    await componentInstance.updateComplete;

    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('200 / 2000');
  });

  it('should calculate macro percentages as distribution', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    componentInstance.caloriesEaten = 500;
    componentInstance.fatEaten = 20; // 180 kcal -> 36% of 500
    componentInstance.carbsEaten = 50; // 200 kcal -> 40% of 500
    componentInstance.proteinEaten = 30; // 120 kcal -> 24% of 500

    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;
    const macros = shadow?.querySelectorAll('.macros-label div');

    expect(macros?.[0].textContent).to.contain('40 /'); // Carbs is first in track order, but labels are Carbs, Fat, Protein
    expect(macros?.[1].textContent).to.contain('36 /'); // Fat
    expect(macros?.[2].textContent).to.contain('24 /'); // Protein
  });

  it('should use provided eaten percentages if available', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    componentInstance.fatEatenPercent = 15;
    componentInstance.carbsEatenPercent = 25;
    componentInstance.proteinEatenPercent = 20;

    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;
    const macros = shadow?.querySelectorAll('.macros-label div');

    expect(macros?.[0].textContent).to.contain('25 /');
    expect(macros?.[1].textContent).to.contain('15 /');
    expect(macros?.[2].textContent).to.contain('20 /');
  });
});
