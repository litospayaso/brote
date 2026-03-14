import { html, css, type PropertyValues } from 'lit';
import { state, property } from 'lit/decorators.js';
import Page from '../../shared/page';
import type { MealCategory, UserProfile } from '../../shared/db';
import type { BarLineChartData } from '../componentBarLineChart/componentBarLineChart';
import type { ShapeChartData } from '../componentShapeChart/componentShapeChart';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import '../componentMaintenanceCalories/componentMaintenanceCalories';


export default class PageUser extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }
      
      .section-title {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--app-text-color-primary, #333);
      }

      .macro-inputs {
        display: flex;
        gap: 10px;
      }

      @media (max-width: 600px) {
        .macro-inputs {
          flex-direction: column;
        }
      }

      .macro-inputs .form-group {
        flex: 1;
      }

      .theme-toggles {
        display: flex;
        gap: 10px;
      }

      .theme-toggles button {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        background: transparent;
        cursor: pointer;
        border-radius: 4px;
        color: inherit;
      }

      .theme-toggles button.active {
        background: var(--palette-green, #4caf50);
        color: white;
        border-color: var(--palette-green, #4caf50);
      }

      .input-calories {
        border-color: var(--calories-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-protein {
        border-color: var(--protein-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-carbs {
        border-color: var(--carbs-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-fat {
        border-color: var(--fat-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .danger-zone {
        border: 1px solid var(--palette-red, #f44336);
        background: rgba(244, 67, 54, 0.1);
      }
      .btn-secondary {
        background: #ccc;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      .weight-history-list {
        max-height: 250px;
        overflow-y: auto;
        margin-bottom: 1rem;
        text-align: left;
      }
      .weight-history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0 8px 8px;
        border: 1px solid var(--card-border);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      .weight-history-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid var(--palette-green);
      }
      .chart-wrapper {
        height: 200px;
        margin: 15px 0;
      }
      .favorite-icon {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: var(--fat-color);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: fill 0.3s ease, stroke 0.3s ease;
        padding: 5px;
        border-radius: 4px;
        cursor: pointer;
      }
      .file-input-wrapper {
        position: relative;
        display: inline-block;
        margin-top: 10px;
        width: 100%;
      }
      .file-input-wrapper input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      .import-msg {
        margin-top: 8px;
        font-size: 0.9rem;
      }
      .import-msg.success { color: var(--palette-green, #4caf50); }
      .import-msg.error { color: var(--palette-red, #f44336); }

      .app-version {
        text-align: center;
        margin-top: 2rem;
        padding-bottom: 2rem;
        font-size: 0.8rem;
        opacity: 0.6;
        color: var(--app-text-color-primary, #999);
      }

      .week-selector {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        gap: 10px;
        color: var(--card-text);
      }
      .week-selector button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.8rem;
        padding: 0 15px;
        line-height: 1;
        transition: transform 0.2s;
      }
      .week-selector button:active {
        transform: scale(1.2);
      }
      .week-display {
        font-size: 1.1rem;
        font-weight: bold;
      }
    `
  ];

  @property() version?: string;

  @state() height: number = 0;
  @state() weight: number = 0;
  @state() age: number = 30;
  @state() gender: 'male' | 'female' | 'non-binary' = 'male';
  @state() dailyCalories: number = 2000;
  @state() proteinRatio: number = 30;
  @state() carbsRatio: number = 40;
  @state() fatRatio: number = 30;
  @state() defaultBasalCalories: number = 0;

  @state() notificationsEnabled: boolean = false;
  @state() notificationTime: string = '20:00';

  @state() theme: 'light' | 'dark' = 'light';
  @state() language: string = 'en';
  @state() enableWarnings: boolean = true;
  @state() enableStatistics: boolean = false;
  @state() showClearModal: boolean = false;
  @state() showStatisticsModal: boolean = false;
  @state() showWeightModal: boolean = false;
  @state() weightHistory: { date: string, weight: number }[] = [];
  @state() newWeightDate: string = new Date().toISOString().split('T')[0];
  @state() newWeightValue: number = 0;
  @state() showExportModal: boolean = false;
  @state() exportFormat: 'json' | 'csv' = 'json';
  @state() exportStores: Set<string> = new Set(['daily_consumption', 'user_data', 'meals', 'products', 'favorites', 'user_status']);
  @state() private weeklyChartData: BarLineChartData | null = null;
  @state() private radarChartData: ShapeChartData | null = null;
  @state() showImportModal: boolean = false;
  @state() showMaintenanceModal: boolean = false;
  @state() importData: any = null;
  @state() importOverride: boolean = false;
  @state() importMessage: { text: string, type: 'success' | 'error' } | null = null;
  @state() statsReferenceDate: string = new Date().toISOString().split('T')[0];
  @state() showAboutModal: boolean = false;

  private _statsTouchStartX: number = 0;
  private _statsTouchStartY: number = 0;

  protected handleSwipe(diffX: number): void {
    if (diffX > 0) {
      // Swipe left
      this.triggerPageNavigation({ page: 'search' });
    }
  }

  onPageInit(): void {
    const savedProfile = localStorage.getItem('user_profile');

    this.language = this.getLanguage();
    this.theme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';

    if (savedProfile) {
      try {
        const profile: UserProfile = JSON.parse(savedProfile);
        this.height = profile.height || 0;
        this.weight = profile.weight || 0;
        this.gender = profile.gender || 'male';
        this.age = profile.age || 30;
        this.dailyCalories = profile.goals?.calories || 2000;
        this.proteinRatio = profile.goals?.macros?.protein || 30;
        this.carbsRatio = profile.goals?.macros?.carbs || 40;
        this.fatRatio = profile.goals?.macros?.fat || 30;
        this.defaultBasalCalories = profile.goals?.defaultBasalCalories || 0;
        this.notificationsEnabled = !!profile.notificationsEnabled;
        this.notificationTime = profile.notificationTime || '20:00';
        this.enableWarnings = profile.enableWarnings !== false;
        this.enableStatistics = !!profile.enableStatistics;
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    } else {
      const legacyHeight = localStorage.getItem('userHs');
      const legacyWeight = localStorage.getItem('userWs');

      if (legacyHeight) this.height = Number(legacyHeight);
      if (legacyWeight) this.weight = Number(legacyWeight);

      this._saveProfile();
    }

    this._loadWeightHistory();
    this._loadWeeklyStats();
  }

  private async _loadWeightHistory() {
    this.weightHistory = await this.db.getWeightHistory();
    if (this.weight) {
      this.newWeightValue = this.weight;
    }
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('language')) {
      this.setLanguage(this.language);
    }
  }

  private _saveProfile() {
    const profile: UserProfile = {
      height: this.height,
      weight: this.weight,
      gender: this.gender,
      age: this.age,
      goals: {
        calories: this.dailyCalories,
        defaultBasalCalories: this.defaultBasalCalories,
        macros: {
          protein: this.proteinRatio,
          carbs: this.carbsRatio,
          fat: this.fatRatio
        }
      },
      notificationsEnabled: this.notificationsEnabled,
      notificationTime: this.notificationTime,
      enableWarnings: this.enableWarnings,
      enableStatistics: this.enableStatistics
    };
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }

  private async _handleNumberInput(field: 'height' | 'weight' | 'age' | 'dailyCalories' | 'proteinRatio' | 'carbsRatio' | 'fatRatio' | 'defaultBasalCalories', e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    // @ts-ignore
    this[field] = value;
    this._saveProfile();

    if (field === 'weight') {
      const today = new Date().toISOString().split('T')[0];
      await this.db.saveWeightEntry(today, value);
      await this._loadWeightHistory();
    }
  }

  private _handleGenderChange(e: Event) {
    this.gender = (e.target as HTMLSelectElement).value as 'male' | 'female' | 'non-binary';
    this._saveProfile();
  }

  private async _handleSaveCalories(e: CustomEvent) {
    const { calories, height, weight, gender, age, proteinRatio, carbsRatio, fatRatio } = e.detail;

    this.dailyCalories = calories;
    this.height = height;
    this.weight = weight;
    this.gender = gender;
    this.age = age;
    // We don't store activity level in the profile currently, but we update the cals
    this.proteinRatio = proteinRatio;
    this.carbsRatio = carbsRatio;
    this.fatRatio = fatRatio;

    this._saveProfile();

    if (this.weight) {
      const today = new Date().toISOString().split('T')[0];
      await this.db.saveWeightEntry(today, this.weight);
      await this._loadWeightHistory();
    }

    this.showMaintenanceModal = false;
  }

  private _handleThemeChange(theme: 'light' | 'dark') {
    this.setTheme(theme);
  }

  private _handleLanguageChange(e: Event) {
    this.language = (e.target as HTMLSelectElement).value;
    this.setLanguage(this.language);
  }

  private async _handleNotificationToggle() {
    this.notificationsEnabled = !this.notificationsEnabled;
    this._saveProfile();
    window.dispatchEvent(new CustomEvent('notification-settings-changed'));
  }

  private async _handleNotificationTimeChange(e: Event) {
    this.notificationTime = (e.target as HTMLInputElement).value;
    this._saveProfile();
    window.dispatchEvent(new CustomEvent('notification-settings-changed'));
  }

  private _handleWarningsToggle(e: Event) {
    this.enableWarnings = (e.target as HTMLInputElement).checked;
    this._saveProfile();
  }

  private _handleStatisticsToggle(e: Event) {
    const isActivating = (e.target as HTMLInputElement).checked;
    if (isActivating && this.enableWarnings) {
      this.showStatisticsModal = true;
      (e.target as HTMLInputElement).checked = false; // Revert visually until confirmed
    } else {
      this.enableStatistics = isActivating;
      this._saveProfile();
    }
  }

  private _confirmEnableStatistics() {
    this.enableStatistics = true;
    this._saveProfile();
    this.showStatisticsModal = false;
  }

  private async _loadWeeklyStats() {
    const refDate = new Date(this.statsReferenceDate);
    const day = refDate.getDay();
    const diff = refDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date(refDate).setDate(diff));

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d.toISOString().split('T')[0]);
    }

    const promises = weekDates.map(date => Promise.all([
      this.db.getDailyLog(date),
      this.db.getUserStatus(date)
    ]));

    const results = await Promise.all(promises);

    const labels = weekDates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString(this.language, { weekday: 'short' });
    });

    const consumedData: number[] = [];
    const burnedStackedData: number[][] = [];
    const satietyData: number[] = [];
    const energyData: number[] = [];
    const sleepData: number[] = [];
    const stepsData: number[] = [];

    results.forEach(([log, status]) => {
      // Consumed
      let eaten = 0;
      const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];
      categories.forEach(cat => {
        log[cat].forEach(item => {
          const ratio = item.unit === 'meal' ? item.quantity : item.quantity / 100;
          eaten += (item.product.nutriments['energy-kcal'] || 0) * ratio;
        });
      });
      consumedData.push(Math.round(eaten));

      // Burned (Stacked: Basal + Exercise)
      const basal = status.basalCalories || this.defaultBasalCalories || 0;
      const exercise = status.exerciseCalories || 0;
      burnedStackedData.push([basal, exercise]);

      // Satiety
      satietyData.push(status.hungerLevel || 0);

      // Sleep
      sleepData.push(status.sleepHours || 0);

      // Energy
      energyData.push(status.energyLevel || 0);

      // Steps
      stepsData.push(status.steps || 0);
    });

    const getAvg = (data: number[]) => {
      const filtered = data.filter(v => v !== 0);
      return filtered.length > 0 ? filtered.reduce((a, b) => a + b, 0) / filtered.length : 0;
    };

    const avgConsumed = getAvg(consumedData);
    const avgBasal = getAvg(results.map(([_, s]) => s.basalCalories || 0));
    const avgExercise = getAvg(results.map(([_, s]) => s.exerciseCalories || 0));
    const burnedTotals = results.map(([_, s]) => (s.basalCalories || 0) + (s.exerciseCalories || 0));
    const avgBurnedTotal = getAvg(burnedTotals);
    const avgSleep = getAvg(sleepData);
    const avgEnergy = getAvg(energyData);
    const avgSatiety = getAvg(satietyData);
    const avgSteps = getAvg(stepsData);

    const formatLabel = (label: string, avg: number, type: 'calories' | 'time' | 'level' | 'steps') => {
      if (type === 'calories') {
        return `${label} (${Math.round(avg)} kcal)`;
      } else if (type === 'time') {
        const h = Math.floor(avg);
        const m = Math.round((avg - h) * 60);
        const formattedTime = `${h}h ${m.toString().padStart(2, '0')}m`;
        return `${label} (${formattedTime})`;
      } else if (type === 'steps') {
        return `${label} (${Math.round(avg)} pasos)`;
      } else {
        return `${label} (${avg.toFixed(1)})`;
      }
    };

    this.weeklyChartData = {
      labels,
      datasets: [
        {
          label: formatLabel(this.translations.consumed || 'Consumidas', avgConsumed, 'calories'),
          type: 'bar',
          data: consumedData,
          yAxisID: 'y'
        },
        {
          label: this.translations.burned || 'Quemadas',
          type: 'bar',
          data: burnedStackedData,
          stackLabels: [
            formatLabel(this.translations.basalCalories || 'Basal', avgBasal, 'calories'),
            formatLabel(this.translations.exerciseCalories || 'Deporte', avgExercise, 'calories'),
            formatLabel(this.translations.total || 'Total', avgBurnedTotal, 'calories')
          ],
          yAxisID: 'y'
        },
        {
          label: formatLabel(this.translations.stepsTaken || 'Pasos', avgSteps, 'steps'),
          type: 'bar',
          data: stepsData.map(v => v / 10),
          color: 'var(--palette-blue)',
          yAxisID: 'y'
        },
        {
          label: formatLabel(this.translations.sleepHours || 'Sueño', avgSleep, 'time'),
          type: 'line',
          data: sleepData,
          yAxisID: 'y1',
          dashed: true,
          color: 'var(--sleep-hours-color)'
        },
        {
          label: formatLabel(this.translations.energyLevel || 'Energía', avgEnergy, 'level'),
          type: 'line',
          data: energyData,
          yAxisID: 'y1'
        },
        {
          label: formatLabel(this.translations.hungerLevel || 'Saciedad', avgSatiety, 'level'),
          type: 'line',
          data: satietyData,
          yAxisID: 'y1',
          dotted: true
        }
      ]
    };

    // Radar Chart Data (0-10 scale)
    this.radarChartData = {
      labels: [
        this.translations.sleepHours || 'Sueño',
        this.translations.movement || 'Movimiento',
        this.translations.energyLevel || 'Energía',
        this.translations.hungerLevel || 'Saciedad',
        this.translations.nutrition || 'Nutrición'
      ],
      datasets: [
        {
          label: '',
          data: [
            Math.min(10, avgSleep),          // 10 hours is max
            Math.min(10, avgSteps / 1000),   // 10,000 steps is max
            Math.min(10, avgEnergy),         // 0-10 scale
            Math.min(10, avgSatiety),        // 0-10 scale
            Math.min(10, avgConsumed / 300)  // 3000 kcal is max
          ]
        }
      ]
    };
  }

  private _changeStatsWeek(delta: number) {
    const d = new Date(this.statsReferenceDate);
    d.setDate(d.getDate() + (delta * 7));
    this.statsReferenceDate = d.toISOString().split('T')[0];
    this._loadWeeklyStats();
  }

  private _handleStatsTouchStart = (e: TouchEvent) => {
    // Stop propagation so the inner swipe doesn't conflict with outer page swipes instantly 
    // although we only stop it on move/end to let scrolling work
    this._statsTouchStartX = e.changedTouches[0].screenX;
    this._statsTouchStartY = e.changedTouches[0].screenY;
  };

  private _handleStatsTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - this._statsTouchStartX;
    const diffY = touchEndY - this._statsTouchStartY;

    // Check if it's primarily a horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      e.stopPropagation(); // prevent outer global swipe
      if (diffX > 0) {
        // Swipe right (previous week chronologically)
        this._changeStatsWeek(-1);
      } else {
        // Swipe left (next week chronologically)
        this._changeStatsWeek(1);
      }
    }
  };

  private _getWeekRangeLabel(): string {
    const refDate = new Date(this.statsReferenceDate);
    const day = refDate.getDay();
    const diff = refDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date(refDate).setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    return `${monday.toLocaleDateString(this.language, options)} - ${sunday.toLocaleDateString(this.language, options)}`;
  }


  private async _clearAllData() {
    try {
      localStorage.clear();
      await this.db.clearAllData();
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear data', e);
      alert('Failed to clear data');
    }
  }

  private async _deleteWeightEntry(date: string) {
    await this.db.deleteWeightEntry(date);
    await this._loadWeightHistory();
  }

  private async _saveNewWeightEntry() {
    if (this.newWeightDate && this.newWeightValue > 0) {
      await this.db.saveWeightEntry(this.newWeightDate, this.newWeightValue);
      await this._loadWeightHistory();

      const today = new Date().toISOString().split('T')[0];
      if (this.newWeightDate === today) {
        this.weight = this.newWeightValue;
        this._saveProfile();
      }
    }
  }

  private async _handleExport() {
    const { content, extension } = await this.db.getExportData(Array.from(this.exportStores), this.exportFormat);

    // Filename: BroteData_YYYY-mm-dd_hh-mm-ss.[json|csv]
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `BroteData_${dateStr}_${timeStr}.${extension}`;

    if (this.isNative) {
      try {
        const result = await Filesystem.writeFile({
          path: filename,
          data: content,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });

        await Share.share({
          title: this.translations.exportShareTitle || 'Brote Export Data',
          text: this.translations.exportShareText || 'Here is your exported data from Brote',
          url: result.uri,
          dialogTitle: this.translations.shareData || 'Share data',
        });
      } catch (err) {
        console.error('Native export failed', err);
      }
    } else {
      const blob = new Blob([content], { type: extension === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    this.showExportModal = false;
  }

  private _toggleExportStore(store: string) {
    const newStores = new Set(this.exportStores);
    if (newStores.has(store)) {
      newStores.delete(store);
    } else {
      newStores.add(store);
    }
    this.exportStores = newStores;
  }

  private _handleFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();

      try {
        if (extension === 'json') {
          this.importData = JSON.parse(content);
        } else if (extension === 'csv') {
          this.importData = this._parseCSV(content);
        } else {
          throw new Error('Unsupported file format');
        }

        this.showImportModal = true;
        this.importMessage = null;
      } catch (err) {
        console.error('Import error:', err);
        this.importMessage = { text: this.translations.fileCannotBeParsed || 'File can not be parsed', type: 'error' };
        this.importData = null;
      }
      // (e.target as HTMLInputElement).value = '';
    };
    reader.readAsText(file);
  }

  private _parseCSV(content: string): any {
    const data: any = {};
    const lines = content.split('\n');
    let currentStore = '';
    let headers: string[] = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('--- ')) {
        const storeName = line.replace(/---/g, '').trim().toLowerCase().replace(/ /g, '_');
        currentStore = storeName === 'saved_meals' ? 'meals' : storeName;
        headers = [];
      } else if (currentStore) {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (headers.length === 0) {
          headers = parts;
        } else {
          const row: any = {};
          headers.forEach((h, i) => {
            row[h] = parts[i];
          });

          if (currentStore === 'daily_consumption') {
            if (!data.daily_consumption) data.daily_consumption = [];
            let log = data.daily_consumption.find((l: any) => l.date === row.Date);
            if (!log) {
              log = { date: row.Date, breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [] };
              data.daily_consumption.push(log);
            }
            const cat = row.Category as MealCategory;
            log[cat].push({
              product: {
                product_name: row.ProductName,
                nutriments: {
                  'energy-kcal': Number(row.Calories),
                  carbohydrates: Number(row.Carbs),
                  fat: Number(row.Fat),
                  proteins: Number(row.Protein)
                }
              },
              quantity: Number(row.Quantity),
              unit: row.Unit
            });
          } else if (currentStore === 'weight_history') {
            if (!data.weight_history) data.weight_history = [];
            data.weight_history.push({ date: row.Date, weight: Number(row.Weight) });
          } else if (currentStore === 'user_profile') {
            data.user_profile = {
              height: Number(row.Height),
              weight: Number(row.Weight),
              gender: row.Gender,
              goals: {
                calories: Number(row.DailyCalories),
                defaultBasalCalories: Number(row.DefaultBasalCalories || 0),
                macros: {
                  protein: Number(row.ProteinRatio || 30),
                  carbs: Number(row.CarbsRatio || 40),
                  fat: Number(row.FatRatio || 30)
                }
              }
            };
          } else if (currentStore === 'meals') {
            if (!data.meals) data.meals = [];
            let meal = data.meals.find((m: any) => m.id === row.MealID);
            if (!meal) {
              meal = { id: row.MealID, name: row.MealName, foods: [] };
              data.meals.push(meal);
            }
            meal.foods.push({
              product: { product_name: row.FoodName },
              quantity: Number(row.Quantity),
              unit: row.Unit
            });
          } else if (currentStore === 'favorites') {
            if (!data.favorites) data.favorites = [];
            data.favorites.push({ code: row.ProductCode });
          } else if (currentStore === 'cached_products') {
            if (!data.products) data.products = [];
            data.products.push({
              code: row.Code,
              status: 1,
              status_verbose: 'product found',
              product: {
                product_name: row.ProductName,
                brands: row.Brands,
                default_grams: Number(row.DefaultGrams || 0),
                nutriments: {
                  'energy-kcal_100g': Number(row.Calories),
                  carbohydrates_100g: Number(row.Carbs),
                  fat_100g: Number(row.Fat),
                  proteins_100g: Number(row.Protein)
                }
              }
            });
          } else if (currentStore === 'user_status') {
            if (!data.user_status) data.user_status = [];
            data.user_status.push({
              date: row.Date,
              exerciseCalories: Number(row.ExerciseCalories),
              basalCalories: Number(row.BasalCalories),
              steps: Number(row.Steps),
              sleepHours: Number(row.SleepHours),
              energyLevel: Number(row.EnergyLevel),
              hungerLevel: Number(row.HungerLevel),
              thoughts: row.Thoughts
            });
          }
        }
      }
    });

    return data;
  }

  private async _proceedImport() {
    if (!this.importData) return;

    try {
      const count = await this.db.importData(this.importData, this.importOverride);
      const successMsg = this.translations.dataImportedCorrectly || 'Data imported correctly.';
      const countMsg = (this.translations.importedNewValues || 'Imported {count} new values.').replace('{count}', count.toString());

      this.importMessage = {
        text: `${successMsg}\n${countMsg}`,
        type: 'success'
      };
      this.showImportModal = false;
      this.importData = null;
      this.onPageInit();
    } catch (err) {
      console.error('Final import error:', err);
      this.importMessage = { text: this.translations.errorImporting || 'Error importing data', type: 'error' };
    } finally {
      this.showImportModal = false;
      this.importData = null;
    }
  }

  private _formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  private _renderTrashIcon(entry: { date: string, weight: number }) {
    return html`
      <svg
        class="favorite-icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="${() => this._deleteWeightEntry(entry.date)}"
      >
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    `;
  }

  render() {
    return html`
      <div class="card">
        <h2>${this.translations.personalDetails}</h2>
        
        <div class="form-group">
          <label>${this.translations.gender}</label>
          <select .value="${this.gender}" @change="${this._handleGenderChange}">
            <option value="male" ?selected="${this.gender === 'male'}">${this.translations.male}</option>
            <option value="female" ?selected="${this.gender === 'female'}">${this.translations.female}</option>
            <option value="non-binary" ?selected="${this.gender === 'non-binary'}">${this.translations.nonBinary}</option>
          </select>
        </div>

        <div class="form-group">
          <label>${this.translations.height} (cm)</label>
          <input type="number" .value="${this.height}" @input="${(e: Event) => this._handleNumberInput('height', e)}" placeholder="e.g. 175" />
        </div>

        <div class="form-group">
          <label>${this.translations.age || 'Age'}</label>
          <input type="number" .value="${this.age}" @input="${(e: Event) => this._handleNumberInput('age', e)}" placeholder="e.g. 30" />
        </div>
        
        <div class="form-group">
          <label>${this.translations.dailyBasalCalories}</label>
          <input type="number" .value="${this.defaultBasalCalories}" @input="${(e: Event) => this._handleNumberInput('defaultBasalCalories', e)}" placeholder="e.g. 1500" />
        </div>
        <div class="form-group">
          <label>${this.translations.weight} (kg)</label>
          <input type="number" step="0.1" .value="${this.weight}" @input="${(e: Event) => this._handleNumberInput('weight', e)}" placeholder="e.g. 70.5" />

          <button class="btn" style="margin-top: 22px;" @click="${() => this.showWeightModal = true}">
            ${this.translations.updateHistoricalWeight}
          </button>
        </div>
      </div>

      ${this.enableStatistics ? html`
      <div class="card">
        <h2>${this.translations.statistics}</h2>
        <div class="week-display">
          <span>
            ${this.translations.weightEvolution}
          </span>
        </div>
        <div class="chart-wrapper">
          <component-line-chart .data="${this.weightHistory.map(h => ({ tag: h.date, value: h.weight }))}"></component-line-chart>
        </div>

        <div class="week-statistics-container" @touchstart="${this._handleStatsTouchStart}" @touchend="${this._handleStatsTouchEnd}">
          <div class="week-selector">
            <button @click="${() => this._changeStatsWeek(-1)}">‹</button>
            <div class="week-display">
              <span>${this.translations.weekOf} ${this._getWeekRangeLabel()}</span>
            </div>
            <button @click="${() => this._changeStatsWeek(1)}">›</button>
          </div>
            ${this.weeklyChartData ? html`
              <component-bar-line-chart .chartData="${this.weeklyChartData}"></component-bar-line-chart>
            ` : ''}
  
            ${this.radarChartData ? html`
              <div style="margin-top: 20px; height: 300px;">
                <component-shape-chart .chartData="${this.radarChartData}"></component-shape-chart>
              </div>
            ` : ''}
          
        </div>
      </div>
      ` : ''}

      <div class="card">
        <h2>${this.translations.nutritionalGoals}</h2>
        
        <div class="form-group">
          <label>${this.translations.dailyCalories}</label>
          <input class="input-calories" type="number" .value="${this.dailyCalories}" @input="${(e: Event) => this._handleNumberInput('dailyCalories', e)}" placeholder="e.g. 2000" />
        </div>

        <label>${this.translations.macroRatio} (%)</label>
        <div class="macro-inputs">
          <div class="form-group">
            <label>${this.translations.protein}</label>
            <input class="input-protein" type="number" .value="${this.proteinRatio}" @input="${(e: Event) => this._handleNumberInput('proteinRatio', e)}" />
          </div>
          <div class="form-group">
            <label>${this.translations.carbs}</label>
            <input class="input-carbs" type="number" .value="${this.carbsRatio}" @input="${(e: Event) => this._handleNumberInput('carbsRatio', e)}" />
          </div>
          <div class="form-group">
            <label>${this.translations.fat}</label>
            <input class="input-fat" type="number" .value="${this.fatRatio}" @input="${(e: Event) => this._handleNumberInput('fatRatio', e)}" />
          </div>
        </div>
        <div style="font-size: 0.8rem; color: #666; margin-top: 5px; text-align: right;">
          ${this.translations.total}: ${this.proteinRatio + this.carbsRatio + this.fatRatio}%
        </div>
        
        <button class="btn" style="margin-top: 20px; width: 100%;" @click="${() => this.showMaintenanceModal = true}">
          ${this.translations.calculateMaintenance || 'Calculate Maintenance Calories'}
        </button>
      </div>

      <div class="card">
        <h2>${this.translations.settings}</h2>
        <div class="form-group">
          <label>${this.translations.theme}</label>
          <div class="theme-toggles">
            <button class="btn" style="color: white; background-color:var(--palette-green)" @click="${() => this._handleThemeChange('light')}">${this.translations.light}</button>
            <button class="btn" style="color: white; background-color:var(--palette-purple)" @click="${() => this._handleThemeChange('dark')}">${this.translations.dark}</button>
          </div>
        </div>
        <div class="form-group">
          <label>${this.translations.language}</label>
          <select .value="${this.language}" @change="${this._handleLanguageChange}">
            <option value="en" ?selected="${this.language === 'en'}">English</option>
            <option value="es" ?selected="${this.language === 'es'}">Español</option>
            <option value="fr" ?selected="${this.language === 'fr'}">Français</option>
            <option value="de" ?selected="${this.language === 'de'}">Deutsch</option>
            <option value="it" ?selected="${this.language === 'it'}">Italiano</option>
          </select>
        </div>
        <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--card-border);">
          <div style="flex: 1;">
            <label style="margin-bottom: 2px;">${this.translations.enableWarnings || 'Enable warning messages'}</label>
          </div>
          <div style="display: flex; align-items: center; gap: 24px;">
            <label class="switch">
              <input 
                type="checkbox" 
                ?checked="${this.enableWarnings}" 
                @change="${this._handleWarningsToggle}"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--card-border);">
          <div style="flex: 1;">
            <label style="margin-bottom: 2px;">${this.translations.enableStatistics || 'Enable statistics'}</label>
          </div>
          <div style="display: flex; align-items: center; gap: 24px;">
            <label class="switch">
              <input 
                type="checkbox" 
                .checked="${this.enableStatistics}" 
                @change="${this._handleStatisticsToggle}"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--card-border);">
          <div style="flex: 1;">
            <label style="margin-bottom: 2px;">${this.translations.dailyStatusReminder}</label>
            <span style="font-size: 0.8rem; opacity: 0.8;">${this.translations.reminderTime}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 24px;">
            <input 
              type="time" 
              .value="${this.notificationTime}" 
              ?disabled="${!this.notificationsEnabled}"
              @input="${this._handleNotificationTimeChange}"
              style="width: 100px; padding: 4px 8px; font-size: 0.9rem;"
            />
            <label class="switch">
              <input 
                type="checkbox" c
                ?checked="${this.notificationsEnabled}" 
                @change="${this._handleNotificationToggle}"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>${this.translations.dataManagement}</h2>
        <p style="margin-bottom: 10px;">${this.translations.exportDataDesc}</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn" @click="${() => this.showExportModal = true}">
            ${this.translations.exportData}
          </button>
          
          <div class="file-input-wrapper">
            <button class="btn">${this.translations.importData}</button>
            <input type="file" accept=".json,.csv" @change="${this._handleFileSelect}" />
          </div>
        </div>

        ${this.importMessage ? html`
          <div class="import-msg ${this.importMessage.type}">
            ${this.importMessage.text.split('\n').map(line => html`<div>${line}</div>`)}
          </div>
        ` : ''}
      </div>

      <div class="card danger-zone">
        <h2>${this.translations.dangerZone}</h2>
        <p style="margin-bottom: 10px;">${this.translations.clearDataWarning}</p>
        <button class="btn-danger" @click="${() => this.showClearModal = true}">
          ${this.translations.clearAllData}
        </button>
      </div>

      ${this.version ? html`
        <div class="app-version">
          ${this.translations.appVersion}: ${this.version}
          <div style="margin-top: 10px;">
            <a href="#" @click="${(e: Event) => { e.preventDefault(); this.showAboutModal = true; }}" style="color: var(--palette-green); text-decoration: underline; cursor: pointer;">
              ${this.translations.aboutApp || 'About Brote'}
            </a>
          </div>
        </div>
      ` : ''}

      ${this.showAboutModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 500px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.aboutApp || 'About Brote'}</h3>
              <button class="close-btn" @click="${() => this.showAboutModal = false}">&times;</button>
            </div>
            <div style="text-align: justify; line-height: 1.6; font-size: 0.95rem; margin-top: 10px;">
              <p>${this.translations.aboutMessage}</p>
            </div>
          </div>
        </div>
      ` : ''}

      ${this.showClearModal ? html`
        <div class="modal-overlay">
          <div class="modal">
            <div class="modal-header">
              <h3>${this.translations.confirmClearData || 'Confirm Clear Data'}</h3>
              <button class="close-btn" @click="${() => this.showClearModal = false}">&times;</button>
            </div>
            <p>${this.translations.clearDataMsg || 'Are you sure you want to clear all app data? This action cannot be undone.'}</p>
            <div class="modal-buttons">
              <button class="btn" @click="${() => this.showClearModal = false}">${this.translations.cancel || 'Cancel'}</button>
              <button class="btn-danger" @click="${this._clearAllData}">${this.translations.clear || 'Clear'}</button>
            </div>
          </div>
        </div>
      ` : ''}

      ${this.showWeightModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 500px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.weightHistory || 'Weight History'}</h3>
              <button class="close-btn" @click="${() => this.showWeightModal = false}">&times;</button>
            </div>
            
            <div class="weight-history-list">
              ${this.weightHistory.length === 0 ? html`<p style="text-align: center;">${this.translations.noResultsFound || 'No history found'}</p>` : ''}
              ${this.weightHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => html`
                <div class="weight-history-item">
                  <span>${this._formatDate(entry.date)}</span>
                  <div style="display: flex; align-items: center; gap: 12px; padding-right: 8px;">
                    <strong>${entry.weight} kg</strong>
                    ${this._renderTrashIcon(entry)}
                  </div>
                </div>
              `)}
            </div>

            <div class="weight-history-form">
              <div class="form-group" style="text-align: left;">
                <label>${this.translations.date || 'Date'}</label>
                <input type="date" .value="${this.newWeightDate}" @change="${(e: any) => this.newWeightDate = e.target.value}" />
              </div>
              <div class="form-group" style="text-align: left;">
                <label>${this.translations.weight || 'Weight'} (kg)</label>
                <input type="number" step="0.1" .value="${this.newWeightValue}" @input="${(e: any) => this.newWeightValue = Number(e.target.value)}" />
              </div>
              <button class="btn" @click="${this._saveNewWeightEntry}">
                ${this.translations.saveEntry || 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      ${this.showExportModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 450px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.exportData}</h3>
              <button class="close-btn" @click="${() => this.showExportModal = false}">&times;</button>
            </div>

            <div style="text-align: left; margin-bottom: 20px;">
              <p style="font-weight: bold; margin-bottom: 10px;">${this.translations.selectDataToExport}:</p>
              
              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('daily_consumption')}" @change="${() => this._toggleExportStore('daily_consumption')}">
                ${this.translations.dailyConsumption}
              </label>
              
              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('user_data')}" @change="${() => this._toggleExportStore('user_data')}">
                ${this.translations.userData}
              </label>

              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('meals')}" @change="${() => this._toggleExportStore('meals')}">
                ${this.translations.savedMeals}
              </label>

              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('products')}" @change="${() => this._toggleExportStore('products')}">
                ${this.translations.cachedProducts}
              </label>

              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('favorites')}" @change="${() => this._toggleExportStore('favorites')}">
                ${this.translations.favorites}
              </label>

              <label class="checkbox-label">
                <input type="checkbox" ?checked="${this.exportStores.has('user_status')}" @change="${() => this._toggleExportStore('user_status')}">
                ${this.translations.dailyStatus}
              </label>

              <p style="font-weight: bold; margin: 20px 0 10px;">${this.translations.selectExportFormat}:</p>
              
              <div style="display: flex; gap: 20px; justify-content: center;">
                <label class="radio-label">
                  <input type="radio" name="format" value="json" ?checked="${this.exportFormat === 'json'}" @change="${() => this.exportFormat = 'json'}">
                  JSON
                </label>
                <label class="radio-label">
                  <input type="radio" name="format" value="csv" ?checked="${this.exportFormat === 'csv'}" @change="${() => this.exportFormat = 'csv'}">
                  CSV
                </label>
              </div>
            </div>

            <button class="btn" style="width: 100%;" ?disabled="${this.exportStores.size === 0}" @click="${this._handleExport}">
              ${this.translations.exportConfirm}
            </button>
          </div>
        </div>
      ` : ''}

      ${this.showImportModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 400px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.confirmImport}</h3>
              <button class="close-btn" @click="${() => this.showImportModal = false}">&times;</button>
            </div>
            <p>${this.translations.confirmOverrideMsg}</p>
            
            <label class="checkbox-label" style="justify-content: center; margin: 20px 0;">
              <input type="checkbox" .checked="${this.importOverride}" @change="${(e: any) => this.importOverride = e.target.checked}">
              ${this.translations.overrideCurrentData}
            </label>

            <div class="modal-buttons">
              <button class="btn" @click="${() => this.showImportModal = false}">${this.translations.cancel}</button>
              <button class="btn" @click="${this._proceedImport}">${this.translations.import}</button>
            </div>
          </div>
        </div>
      ` : ''}

      ${this.showMaintenanceModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 500px; max-width: 95%; position: relative;">
            <div class="modal-header">
              <h3>${this.translations.calculateMaintenance || 'Calculate Maintenance Calories'}</h3>
              <button class="close-btn" @click="${() => this.showMaintenanceModal = false}">&times;</button>
            </div>
            
            <component-maintenance-calories
              .height="${this.height}"
              .weight="${this.weight}"
              .gender="${this.gender}"
              .age="${this.age}"
              .showWarning="${this.enableWarnings}"
              .translations="${JSON.stringify(this.translations)}"
              @save-calories="${this._handleSaveCalories}"
            ></component-maintenance-calories>
          </div>
        </div>
      ` : ''}

      ${this.showStatisticsModal ? html`
        <div class="modal-overlay">
          <div class="modal">
            <div class="modal-header">
              <h3 style="color: var(--palette-green);">${this.translations.statisticsWarningTitle || 'Warning regarding statistical tracking'}</h3>
              <button class="close-btn" @click="${() => this.showStatisticsModal = false}">&times;</button>
            </div>
            <div class="warning-message">
              <span>
                <span class="warning-icon">⚠️</span>${this.translations.statisticsWarningMessage || 'Please be careful...'}
              </span>
            </div>
            <div class="modal-buttons" style="justify-content: space-around;">
              <button class="btn btn-cancel" @click="${() => this.showStatisticsModal = false}">${this.translations.cancel || 'Cancel'}</button>
              <button class="btn btn-confirm" @click="${this._confirmEnableStatistics}">${this.translations.confirm || 'Confirm'}</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}
