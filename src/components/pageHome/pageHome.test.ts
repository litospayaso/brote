import { expect } from '@esm-bundle/chai';
import { accessibilityCheck, createComponent, mockQueryParams } from '../../shared/test-helper';

import './index';
import PageHome from './pageHome';

const sampleDailyLog = {
  date: '2024-01-01',
  breakfast: [{
    product: {
      code: '123',
      product_name: 'Test Breakfast',
      brands: 'Test Brand',
      nutriments: { 'energy-kcal': 200, carbohydrates: 20, fat: 10, proteins: 5 }
    },
    quantity: 100,
    unit: 'g'
  }],
  snack1: [],
  lunch: [],
  snack2: [],
  dinner: [],
  snack3: []
};

const sampleUserStatus = {
  date: '2024-01-01',
  exerciseCalories: 100,
  basalCalories: 1500,
  steps: 5000,
  sleepHours: 7,
  energyLevel: 3,
  hungerLevel: 2,
  thoughts: 'Feeling good'
};

const createMockDb = (dailyLog: any, userStatus: any = null): any => ({
  init: () => Promise.resolve(),
  getDailyLog: () => Promise.resolve(dailyLog),
  getUserStatus: () => Promise.resolve(userStatus),
  removeFoodItem: () => Promise.resolve(),
  saveUserStatus: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(undefined),
  isFavorite: () => Promise.resolve(false),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([])
});

describe('PageHome Component Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home',
      db: createMockDb(sampleDailyLog, sampleUserStatus),
      mock: {
        firstUpdated: () => {}
      }
    });
    element = component.element;
  });

  afterEach(() => {
    try {
      document.body.removeChild(element);
    } catch (e) {}
  });

  it('should contain shadow root', () => {
    expect(element.shadowRoot).to.exist;
  });

  xit('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.lessThan(5);
  });

  it('should render summary cards with correct classes', async () => {
    await (element as any).updateComplete;
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

  it('should render header with date selector', async () => {
    await (element as any).updateComplete;
    const header = element.shadowRoot?.querySelector('.header');
    expect(header).to.exist;

    const dateSelector = element.shadowRoot?.querySelector('.date-selector');
    expect(dateSelector).to.exist;

    const dateDisplay = element.shadowRoot?.querySelector('.date-display');
    expect(dateDisplay).to.exist;

    const dateInput = element.shadowRoot?.querySelector('input[type="date"]');
    expect(dateInput).to.exist;
  });

  it('should render progress bar component', async () => {
    await (element as any).updateComplete;
    const progressBar = element.shadowRoot?.querySelector('component-progress-bar');
    expect(progressBar).to.exist;
  });

  it('should render category sections when daily log has items', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.totals = { calories: 200, carbs: 20, fat: 10, protein: 5 };
    await el.updateComplete;
    
    const categorySections = element.shadowRoot?.querySelectorAll('.category-section');
    expect(categorySections?.length).to.be.greaterThan(0);
  });

  it('should handle previous day button click', async () => {
    const el = element as any;
    el.loading = false;
    await el.updateComplete;
    
    const prevButton = el.shadowRoot.querySelector('.date-selector button:first-child') as HTMLButtonElement;
    prevButton?.click();
    await el.updateComplete;
    
    expect(el.currentDate).to.not.equal(new Date().toISOString().split('T')[0]);
  });

  it('should handle next day button click', async () => {
    const el = element as any;
    el.loading = false;
    await el.updateComplete;
    
    const nextButton = el.shadowRoot.querySelector('.date-selector button:last-child') as HTMLButtonElement;
    nextButton?.click();
    await el.updateComplete;
    
    expect(el.currentDate).to.not.equal(new Date().toISOString().split('T')[0]);
  });

  it('should change date when date input changes', async () => {
    const el = element as any;
    el.loading = false;
    el.loadData = () => Promise.resolve();
    await el.updateComplete;
    
    const dateInput = el.shadowRoot.querySelector('input[type="date"]') as HTMLInputElement;
    dateInput.value = '2024-01-15';
    dateInput.dispatchEvent(new Event('change'));
    await el.updateComplete;
    
    expect(el.currentDate).to.equal('2024-01-15');
  });

  it('should render add food button when daily log is empty', async () => {
    const emptyComponent = await createComponent({
      class: PageHome,
      name: 'page-home-empty',
      db: createMockDb(null, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = emptyComponent.element as any;
    el.dailyLog = null;
    el.loading = false;
    el.enableWarnings = true;
    await el.updateComplete;

    const addButton = el.shadowRoot?.querySelector('.btn');
    expect(addButton).to.exist;
    document.body.removeChild(el);
  });

  it('should navigate to search page when add food button is clicked', async () => {
    const emptyComponent = await createComponent({
      class: PageHome,
      name: 'page-home-add-click',
      db: createMockDb(null, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = emptyComponent.element as any;
    el.dailyLog = null;
    el.loading = false;
    await el.updateComplete;

    let navigated = false;
    (el as any).triggerPageNavigation = (params: any) => {
      if (params.page === 'search') {
        navigated = true;
      }
    };

    const addButton = el.shadowRoot?.querySelector('.btn') as HTMLButtonElement;
    addButton?.click();
    await el.updateComplete;

    expect(navigated).to.be.true;
    document.body.removeChild(el);
  });

  it('should load user profile from localStorage', async () => {
    const testProfile = {
      goals: {
        calories: 2500,
        macros: { protein: 40, carbs: 30, fat: 30 },
        defaultBasalCalories: 1600
      },
      enableWarnings: false,
      enableStatistics: true
    };

    localStorage.setItem('user_profile', JSON.stringify(testProfile));

    const component = await createComponent({
      class: PageHome,
      name: 'page-home-profile',
      db: createMockDb(sampleDailyLog, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element;

    await (el as any).loadUserProfile();

    expect((el as any).userGoals.calories).to.equal(2500);
    expect((el as any).userGoals.macros.protein).to.equal(40);
    expect((el as any).enableStatistics).to.be.true;
    expect((el as any).enableWarnings).to.be.false;

    localStorage.removeItem('user_profile');
    document.body.removeChild(el);
  });

  it('should calculate totals from daily log', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.loading = false;
    
    el.calculateTotals();

    expect(el.totals.calories).to.be.greaterThan(0);
  });

  it('should handle removing food item', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.loading = false;
    
    let removeCalled = false;
    el.db.removeFoodItem = () => {
      removeCalled = true;
      return Promise.resolve();
    };

    await el._handleRemoveItem('breakfast', 0);

    expect(removeCalled).to.be.true;
  });

  it('should handle status changed event', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.loading = false;
    
    let saveCalled = false;
    el.db.saveUserStatus = () => {
      saveCalled = true;
      return Promise.resolve();
    };

    const mockEvent = new CustomEvent('status-changed', {
      detail: {
        exerciseCalories: 200,
        basalCalories: 1500,
        steps: 6000,
        sleepHours: 8,
        energyLevel: 4,
        hungerLevel: 3,
        thoughts: 'Test thoughts'
      }
    });

    await el._handleStatusChanged(mockEvent);

    expect(saveCalled).to.be.true;
    expect(el.userStatus).to.exist;
  });

  it('should handle element click for food navigation', async () => {
    const el = element as any;
    
    let navigated = false;
    el.triggerPageNavigation = (params: any) => {
      if (params.page === 'food' && params.code === '123') {
        navigated = true;
      }
    };

    const item = { product: { code: '123', product_name: 'Test' }, unit: 'g' };
    el._handleElementClick(item);

    expect(navigated).to.be.true;
  });

  it('should handle element click for meal navigation', async () => {
    const el = element as any;
    
    let navigated = false;
    el.triggerPageNavigation = (params: any) => {
      if (params.page === 'meal' && params.mealId === 'meal123') {
        navigated = true;
      }
    };

    const item = { product: { code: 'meal123', product_name: 'Test Meal' }, unit: 'meal' };
    el._handleElementClick(item);

    expect(navigated).to.be.true;
  });

  it('should open status modal when openStatus query param is true', async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home-status-modal',
      db: createMockDb(sampleDailyLog, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;

    mockQueryParams(el, { openStatus: 'true' });

    await el.onPageInit();
    
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(el.openStatusModal).to.be.true;
    document.body.removeChild(el);
  });

  it('should render user status component when enableStatistics is true', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.dailyLog = sampleDailyLog;
    await el.updateComplete;

    const userStatusComponent = el.shadowRoot.querySelector('component-user-status');
    expect(userStatusComponent).to.exist;
  });

  it('should display correct formatted date for today', async () => {
    const el = element as any;
    el.currentDate = new Date().toISOString().split('T')[0];
    await el.updateComplete;

    const dateText = el.shadowRoot.querySelector('.date-display span');
    expect(dateText?.textContent).to.equal(el.translations.today);
  });

  it('should display correct formatted date for yesterday', async () => {
    const el = element as any;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    el.currentDate = yesterday.toISOString().split('T')[0];
    await el.updateComplete;

    const dateText = el.shadowRoot.querySelector('.date-display span');
    expect(dateText?.textContent).to.equal(el.translations.yesterday);
  });

  it('should display correct formatted date for tomorrow', async () => {
    const el = element as any;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    el.currentDate = tomorrow.toISOString().split('T')[0];
    await el.updateComplete;

    const dateText = el.shadowRoot.querySelector('.date-display span');
    expect(dateText?.textContent).to.equal(el.translations.tomorrow);
  });

  it('should render search result components for food items', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.totals = { calories: 200, carbs: 20, fat: 10, protein: 5 };
    await el.updateComplete;
    
    const searchResults = element.shadowRoot?.querySelectorAll('component-search-result');
    expect(searchResults?.length).to.be.greaterThan(0);
  });

  it('should handle date display click', async () => {
    const el = element as any;
    
    el._handleDateDisplayClick();

    const dateInput = el.shadowRoot.querySelector('input[type="date"]');
    expect(dateInput).to.exist;
  });

  it('should render category with add button', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.totals = { calories: 200, carbs: 20, fat: 10, protein: 5 };
    await el.updateComplete;
    
    const categoryHeaders = element.shadowRoot?.querySelectorAll('.category-header');
    expect(categoryHeaders?.length).to.be.greaterThan(0);

    const addButtons = element.shadowRoot?.querySelectorAll('.add-button');
    expect(addButtons?.length).to.be.greaterThan(0);
  });

  it('should navigate to search with category when add button clicked', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.totals = { calories: 200, carbs: 20, fat: 10, protein: 5 };
    await el.updateComplete;
    
    let navigatedWithCategory = false;
    el.triggerPageNavigation = (params: any) => {
      if (params.page === 'search' && params.category === 'breakfast') {
        navigatedWithCategory = true;
      }
    };

    const addButton = el.shadowRoot.querySelector('.add-button') as HTMLElement;
    addButton?.click();
    await el.updateComplete;

    expect(navigatedWithCategory).to.be.true;
  });

  it('should handle loadData error', async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home-error',
      db: {
        init: () => Promise.resolve(),
        getDailyLog: () => Promise.reject(new Error('Failed')),
        getUserStatus: () => Promise.resolve(null),
        getAllCachedProducts: () => Promise.resolve([]),
        getFavorites: () => Promise.resolve([]),
        getCachedProduct: () => Promise.resolve(undefined),
        isFavorite: () => Promise.resolve(false),
        addFavorite: () => Promise.resolve(),
        removeFavorite: () => Promise.resolve(),
        getAllMeals: () => Promise.resolve([])
      },
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;

    await el.loadData();

    expect(el.loading).to.be.false;
    document.body.removeChild(el);
  });

  it('should show day tip component when daily log is empty and warnings enabled', async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home-tip',
      db: createMockDb(null, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;
    el.dailyLog = null;
    el.enableWarnings = true;
    el.loading = false;
    await el.updateComplete;

    const dayTip = el.shadowRoot.querySelector('component-day-tip');
    expect(dayTip).to.exist;
    document.body.removeChild(el);
  });

  it('should not show user status when enableStatistics is false', async () => {
    const el = element as any;
    el.enableStatistics = false;
    el.userStatus = sampleUserStatus;
    el.loading = false;
    el.dailyLog = sampleDailyLog;
    await el.updateComplete;

    const userStatusComponent = el.shadowRoot.querySelector('component-user-status');
    expect(userStatusComponent).to.not.exist;
  });

  it('should not show day tip when enableWarnings is false', async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home-no-tip',
      db: createMockDb(null, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;
    el.dailyLog = null;
    el.enableWarnings = false;
    el.loading = false;
    await el.updateComplete;

    const dayTip = el.shadowRoot.querySelector('component-day-tip');
    expect(dayTip).to.not.exist;
    document.body.removeChild(el);
  });

  it('should not render add button when daily log has items', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.loading = false;
    el.totals = { calories: 200, carbs: 20, fat: 10, protein: 5 };
    await el.updateComplete;
    
    const addButton = element.shadowRoot?.querySelector('.category-container .btn');
    expect(addButton).to.not.exist;
  });

  it('should return empty for category with no items', async () => {
    const el = element as any;
    el.dailyLog = { ...sampleDailyLog, snack1: [] };
    const result = el.renderCategory('snack1', 'snack1');
    expect(result).to.exist;
  });

  it('should handle swipe on header to change date to next day', async () => {
    const el = element as any;
    el.loading = false;
    el.currentDate = new Date().toISOString().split('T')[0];
    const initialDate = el.currentDate;
    await el.updateComplete;
    
    const header = el.shadowRoot.querySelector('.header') as HTMLElement;
    const mockEvent = {
      composedPath: () => [header],
      preventDefault: () => {}
    };
    
    el.handleSwipe(-5, 0, mockEvent as any);
    await el.updateComplete;
    
    expect(el.currentDate).to.not.equal(initialDate);
  });

  it('should handle swipe left on body to navigate to search', async () => {
    const el = element as any;
    el.loading = false;
    el.dailyLog = sampleDailyLog;
    await el.updateComplete;
    
    let navigated = false;
    el.triggerPageNavigation = (params: any) => {
      if (params.page === 'search') {
        navigated = true;
      }
    };
    
    const container = el.shadowRoot.querySelector('.category-container') as HTMLElement;
    const mockEvent = {
      composedPath: () => [container],
      preventDefault: () => {}
    };
    
    el.handleSwipe(-10, 0, mockEvent as any);
    await el.updateComplete;
    
    expect(navigated).to.be.true;
  });

  it('should calculate totals with zero when dailyLog is null', async () => {
    const el = element as any;
    el.dailyLog = null;
    
    el.calculateTotals();
    
    expect(el.totals.calories).to.equal(0);
    expect(el.totals.carbs).to.equal(0);
    expect(el.totals.fat).to.equal(0);
    expect(el.totals.protein).to.equal(0);
  });

  it('should calculate totals with meal unit', async () => {
    const el = element as any;
    el.dailyLog = {
      breakfast: [{
        product: {
          code: 'meal1',
          product_name: 'Test Meal',
          brands: '',
          nutriments: { 'energy-kcal': 500, carbohydrates: 50, fat: 20, proteins: 30 }
        },
        quantity: 1,
        unit: 'meal'
      }],
      snack1: [],
      lunch: [],
      snack2: [],
      dinner: [],
      snack3: []
    };
    
    el.calculateTotals();
    
    expect(el.totals.calories).to.equal(500);
  });

  it('should get formatted date in DD/MM/YYYY format', async () => {
    const el = element as any;
    el.currentDate = '2024-06-15';
    await el.updateComplete;

    const dateText = el.shadowRoot.querySelector('.date-display span');
    expect(dateText?.textContent).to.equal('15/06/2024');
  });

  it('should not call loadData when dailyLog is null in _handleRemoveItem', async () => {
    const el = element as any;
    el.dailyLog = null;
    el.loadData = () => { throw new Error('loadData should not be called'); };
    
    await el._handleRemoveItem('breakfast', 0);
  });

  it('should call loadData when dailyLog exists in _handleRemoveItem', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    let loadDataCalled = false;
    el.loadData = () => { 
      loadDataCalled = true; 
      return Promise.resolve(); 
    };
    el.db.removeFoodItem = () => Promise.resolve();
    
    await el._handleRemoveItem('breakfast', 0);
    
    expect(loadDataCalled).to.be.true;
  });

  it('should save user status on status changed', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = null;
    let saveCalled = false;
    el.db.saveUserStatus = () => { 
      saveCalled = true; 
      return Promise.resolve(); 
    };
    
    const mockEvent = new CustomEvent('status-changed', {
      detail: {
        exerciseCalories: 300,
        basalCalories: 1600,
        steps: 8000,
        sleepHours: 6,
        energyLevel: 5,
        hungerLevel: 4,
        thoughts: 'Test'
      }
    });
    
    await el._handleStatusChanged(mockEvent);
    
    expect(saveCalled).to.be.true;
  });

  it('should call loadData on changeDate', async () => {
    const el = element as any;
    el.loading = false;
    let loadDataCalled = false;
    el.loadData = () => { 
      loadDataCalled = true; 
      return Promise.resolve(); 
    };
    
    el.changeDate(1);
    await el.updateComplete;
    
    expect(loadDataCalled).to.be.true;
  });

  it('should call loadData when date changes via input', async () => {
    const el = element as any;
    el.loading = false;
    let loadDataCalled = false;
    el.loadData = () => { 
      loadDataCalled = true; 
      return Promise.resolve(); 
    };
    
    const dateInput = el.shadowRoot.querySelector('input[type="date"]') as HTMLInputElement;
    dateInput.value = '2024-12-25';
    dateInput.dispatchEvent(new Event('change'));
    await el.updateComplete;
    
    expect(loadDataCalled).to.be.true;
    expect(el.currentDate).to.equal('2024-12-25');
  });

  it('should handle swipe right on header to go to previous day', async () => {
    const el = element as any;
    el.loading = false;
    el.currentDate = new Date().toISOString().split('T')[0];
    const initialDate = el.currentDate;
    await el.updateComplete;
    
    const header = el.shadowRoot.querySelector('.header') as HTMLElement;
    const mockEvent = {
      composedPath: () => [header],
      preventDefault: () => {}
    };
    
    el.handleSwipe(10, 0, mockEvent as any);
    await el.updateComplete;
    
    expect(el.currentDate).to.not.equal(initialDate);
  });

  it('should handle loadUserProfile with invalid JSON', async () => {
    localStorage.setItem('user_profile', 'invalid json');
    
    const el = element as any;
    el.loadUserProfile();
    
    localStorage.removeItem('user_profile');
  });

  it('should handle loadData with error and set loading to false', async () => {
    const component = await createComponent({
      class: PageHome,
      name: 'page-home-error-test',
      db: {
        init: () => Promise.resolve(),
        getDailyLog: () => Promise.reject(new Error('Database error')),
        getUserStatus: () => Promise.reject(new Error('Database error')),
        getAllCachedProducts: () => Promise.resolve([]),
        getFavorites: () => Promise.resolve([]),
        getCachedProduct: () => Promise.resolve(undefined),
        isFavorite: () => Promise.resolve(false),
        addFavorite: () => Promise.resolve(),
        removeFavorite: () => Promise.resolve(),
        getAllMeals: () => Promise.resolve([])
      },
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;
    
    await el.loadData();
    
    expect(el.loading).to.be.false;
    document.body.removeChild(el);
  });

  it('should load user profile with goals but no macros', async () => {
    const testProfile = {
      goals: {
        calories: 2000,
        defaultBasalCalories: 1500
      }
    };

    localStorage.setItem('user_profile', JSON.stringify(testProfile));

    const component = await createComponent({
      class: PageHome,
      name: 'page-home-profile-no-macros',
      db: createMockDb(sampleDailyLog, null),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element;

    await (el as any).loadUserProfile();

    expect((el as any).userGoals.defaultBasalCalories).to.equal(1500);

    localStorage.removeItem('user_profile');
    document.body.removeChild(el);
  });

  it('should handle save user status error', async () => {
    const el = element as any;
    el.dailyLog = sampleDailyLog;
    el.userStatus = null;
    el.db.saveUserStatus = () => Promise.reject(new Error('Save failed'));
    
    const mockEvent = new CustomEvent('status-changed', {
      detail: {
        exerciseCalories: 300,
        basalCalories: 1600,
        steps: 8000,
        sleepHours: 6,
        energyLevel: 5,
        hungerLevel: 4,
        thoughts: 'Test'
      }
    });
    
    await el._handleStatusChanged(mockEvent);
  });
});
