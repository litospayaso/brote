import type { SearchProductItemInterface } from './http.interfaces';

export interface FoodEntry {
  product: SearchProductItemInterface;
  quantity: number;
  unit: string;
}

export type MealCategory = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  breakfast: FoodEntry[];
  snack1: FoodEntry[];
  lunch: FoodEntry[];
  snack2: FoodEntry[];
  dinner: FoodEntry[];
  snack3: FoodEntry[];
}

export interface UserStatus {
  date: string; // YYYY-MM-DD
  exerciseCalories: number;
  basalCalories: number;
  steps: number;
  sleepHours: number;
  energyLevel: number;
  hungerLevel: number;
  thoughts?: string;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  foods: FoodEntry[];
}

export interface UserProfile {
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'non-binary';
  age?: number;
  goals: {
    calories: number;
    defaultBasalCalories?: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    }
  },
  notificationsEnabled?: boolean;
  notificationTime?: string;
  enableWarnings?: boolean;
  enableStatistics?: boolean;
}

const DB_NAME = 'OpenCalDB';
const DB_VERSION = 5;
const STORE_NAME = 'daily_consumption';
const STORE_PRODUCTS = 'products';
const STORE_FAVORITES = 'favorites';
const STORE_MEALS = 'meals';
const STORE_WEIGHT_HISTORY = 'weight_history';
const STORE_USER_STATUS = 'user_status';

export class DBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Database error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
          db.createObjectStore(STORE_PRODUCTS, { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains(STORE_FAVORITES)) {
          db.createObjectStore(STORE_FAVORITES, { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains(STORE_MEALS)) {
          db.createObjectStore(STORE_MEALS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_WEIGHT_HISTORY)) {
          db.createObjectStore(STORE_WEIGHT_HISTORY, { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains(STORE_USER_STATUS)) {
          db.createObjectStore(STORE_USER_STATUS, { keyPath: 'date' });
        }
      };
    });
  }

  async saveWeightEntry(date: string, weight: number): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_WEIGHT_HISTORY], 'readwrite');
      const store = transaction.objectStore(STORE_WEIGHT_HISTORY);
      const request = store.put({ date, weight });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWeightHistory(): Promise<{ date: string, weight: number }[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_WEIGHT_HISTORY], 'readonly');
      const store = transaction.objectStore(STORE_WEIGHT_HISTORY);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result || [];
        result.sort((a: any, b: any) => a.date.localeCompare(b.date));
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWeightEntry(date: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_WEIGHT_HISTORY], 'readwrite');
      const store = transaction.objectStore(STORE_WEIGHT_HISTORY);
      const request = store.delete(date);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDailyLog(date: string): Promise<DailyLog> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(date);

      request.onsuccess = () => {
        const result = request.result as DailyLog;
        if (result) {
          resolve(result);
        } else {
          resolve({
            date,
            breakfast: [],
            snack1: [],
            lunch: [],
            snack2: [],
            dinner: [],
            snack3: [],
          });
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveDailyLog(log: DailyLog): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(log);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getUserStatus(date: string): Promise<UserStatus> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_USER_STATUS], 'readonly');
      const store = transaction.objectStore(STORE_USER_STATUS);
      const request = store.get(date);

      request.onsuccess = () => {
        const result = request.result as UserStatus;
        if (result) {
          resolve(result);
        } else {
          resolve({
            date,
            exerciseCalories: 0,
            basalCalories: 0,
            steps: 0,
            sleepHours: 0,
            energyLevel: 0,
            hungerLevel: 0,
            thoughts: ''
          });
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveUserStatus(status: UserStatus): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_USER_STATUS], 'readwrite');
      const store = transaction.objectStore(STORE_USER_STATUS);
      const request = store.put(status);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addFoodItem(date: string, category: MealCategory, item: FoodEntry): Promise<void> {
    const log = await this.getDailyLog(date);
    log[category].push(item);
    await this.saveDailyLog(log);
  }

  async removeFoodItem(date: string, category: MealCategory, index: number): Promise<void> {
    const log = await this.getDailyLog(date);
    if (log[category] && log[category][index]) {
      log[category].splice(index, 1);
      await this.saveDailyLog(log);
    }
  }

  async cacheProduct(product: any): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readwrite');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedProduct(code: string): Promise<any | undefined> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.get(code);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCachedProducts(): Promise<any[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addFavorite(code: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readwrite');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.put({ code });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFavorite(code: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readwrite');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.delete(code);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async isFavorite(code: string): Promise<boolean> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readonly');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.get(code);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFavorites(): Promise<any[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readonly');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMeal(meal: Meal): Promise<void> {
    await this.ensureInit();

    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readwrite');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.put(meal);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    await this._updateMealInLogs(meal);
  }

  private async _updateMealInLogs(meal: Meal): Promise<void> {
    const totals = meal.foods.reduce((acc, f) => {
      const ratio = f.quantity / 100;
      return {
        calories: acc.calories + (f.product.nutriments?.['energy-kcal'] || 0) * ratio,
        carbs: acc.carbs + (f.product.nutriments?.carbohydrates || 0) * ratio,
        fat: acc.fat + (f.product.nutriments?.fat || 0) * ratio,
        protein: acc.protein + (f.product.nutriments?.proteins || 0) * ratio
      };
    }, { calories: 0, carbs: 0, fat: 0, protein: 0 });

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const log = cursor.value as DailyLog;
          let modified = false;
          const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

          categories.forEach(cat => {
            log[cat].forEach(item => {
              if (item.unit === 'meal' && item.product.code === meal.id) {
                item.product.product_name = meal.name;
                if (!item.product.nutriments) {
                  item.product.nutriments = {} as any;
                }
                item.product.nutriments['energy-kcal'] = totals.calories;
                item.product.nutriments.carbohydrates = totals.carbs;
                item.product.nutriments.fat = totals.fat;
                item.product.nutriments.proteins = totals.protein;

                modified = true;
              }
            });
          });

          if (modified) {
            cursor.update(log);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readonly');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMeals(): Promise<Meal[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readonly');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMeal(id: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readwrite');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateProductInMeals(product: any): Promise<void> {
    await this.ensureInit();

    const meals = await this.getAllMeals();
    const mealsToUpdate: Meal[] = [];

    for (const meal of meals) {
      let mealModified = false;
      if (meal.foods && meal.foods.length > 0) {
        meal.foods.forEach(food => {
          if (food.product.code === product.code) {

            food.product.product_name = (product.product as any).product_name;
            food.product.brands = (product.product as any).brands;

            if ((product.product as any).nutriments) {
              if (!food.product.nutriments) {
                food.product.nutriments = {} as any;
              }
              food.product.nutriments['energy-kcal'] = (product.product as any).nutriments['energy-kcal_100g'];
              food.product.nutriments.carbohydrates = (product.product as any).nutriments.carbohydrates_100g;
              food.product.nutriments.fat = (product.product as any).nutriments.fat_100g;
              food.product.nutriments.proteins = (product.product as any).nutriments.proteins_100g;
            }

            mealModified = true;
          }
        });
      }

      if (mealModified) {
        mealsToUpdate.push(meal);
      }
    }

    for (const meal of mealsToUpdate) {
      await this.saveMeal(meal);
    }
  }

  async updateProductInLogs(product: any): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const log = cursor.value as DailyLog;
          let modified = false;
          const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

          categories.forEach(cat => {
            if (log[cat]) {
              log[cat].forEach(item => {
                if (item.product.code === product.code) {
                  item.product.product_name = (product.product as any).product_name;
                  item.product.brands = (product.product as any).brands;

                  if ((product.product as any).nutriments) {
                    if (!item.product.nutriments) {
                      item.product.nutriments = {} as any;
                    }
                    const newNutriments = (product.product as any).nutriments;
                    item.product.nutriments['energy-kcal'] = newNutriments['energy-kcal_100g'];
                    item.product.nutriments.carbohydrates = newNutriments.carbohydrates_100g;
                    item.product.nutriments.fat = newNutriments.fat_100g;
                    item.product.nutriments.proteins = newNutriments.proteins_100g;
                  }
                  modified = true;
                }
              });
            }
          });

          if (modified) {
            cursor.update(log);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMealReference(mealId: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const log = cursor.value as DailyLog;
          let modified = false;
          const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

          categories.forEach(cat => {
            if (log[cat]) {
              const originalLength = log[cat].length;
              log[cat] = log[cat].filter(item => !(item.unit === 'meal' && item.product.code === mealId));
              if (log[cat].length !== originalLength) {
                modified = true;
              }
            }
          });

          if (modified) {
            cursor.update(log);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getExportData(selectedStores: string[], format: 'json' | 'csv'): Promise<{ content: string, extension: string }> {
    await this.ensureInit();
    const exportData: any = {};

    if (selectedStores.includes('user_data')) {
      const profile = localStorage.getItem('user_profile');
      exportData.user_profile = profile ? JSON.parse(profile) : null;
      exportData.weight_history = await this.getWeightHistory();
    }

    if (selectedStores.includes('daily_consumption')) {
      exportData.daily_consumption = await this._getAllFromStore(STORE_NAME);
    }
    if (selectedStores.includes('products')) {
      exportData.products = await this._getAllFromStore(STORE_PRODUCTS);
    }
    if (selectedStores.includes('favorites')) {
      exportData.favorites = await this._getAllFromStore(STORE_FAVORITES);
    }
    if (selectedStores.includes('meals')) {
      exportData.meals = await this._getAllFromStore(STORE_MEALS);
    }
    if (selectedStores.includes('user_status')) {
      exportData.user_status = await this._getAllFromStore(STORE_USER_STATUS);
    }

    if (format === 'json') {
      return {
        content: JSON.stringify(exportData, null, 2),
        extension: 'json'
      };
    } else {
      let csvContent = '';

      if (exportData.user_profile) {
        csvContent += '--- USER PROFILE ---\n';
        csvContent += 'Height,Weight,Gender,DailyCalories,ProteinRatio,CarbsRatio,FatRatio,DefaultBasalCalories\n';
        const p = exportData.user_profile;
        csvContent += `${p.height || ''},${p.weight || ''},${p.gender || ''},${p.goals?.calories || ''},${p.goals?.macros?.protein || ''},${p.goals?.macros?.carbs || ''},${p.goals?.macros?.fat || ''},${p.goals?.defaultBasalCalories || ''}\n\n`;
      }

      if (exportData.weight_history) {
        csvContent += '--- WEIGHT HISTORY ---\n';
        csvContent += 'Date,Weight\n';
        exportData.weight_history.forEach((h: any) => {
          csvContent += `${h.date},${h.weight}\n`;
        });
        csvContent += '\n';
      }

      if (exportData.daily_consumption) {
        csvContent += '--- DAILY CONSUMPTION ---\n';
        csvContent += 'Date,Category,ProductName,Quantity,Unit,Calories,Carbs,Fat,Protein\n';
        exportData.daily_consumption.forEach((log: DailyLog) => {
          const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];
          categories.forEach(cat => {
            log[cat]?.forEach(item => {
              csvContent += `${log.date},${cat},"${item.product.product_name || ''}",${item.quantity},${item.unit},${item.product.nutriments?.['energy-kcal'] || 0},${item.product.nutriments?.carbohydrates || 0},${item.product.nutriments?.fat || 0},${item.product.nutriments?.proteins || 0}\n`;
            });
          });
        });
        csvContent += '\n';
      }

      if (exportData.meals) {
        csvContent += '--- SAVED MEALS ---\n';
        csvContent += 'MealID,MealName,FoodName,Quantity,Unit\n';
        exportData.meals.forEach((meal: Meal) => {
          meal.foods?.forEach(f => {
            csvContent += `${meal.id},"${meal.name}","${f.product.product_name || ''}",${f.quantity},${f.unit}\n`;
          });
        });
        csvContent += '\n';
      }

      if (exportData.products) {
        csvContent += '--- CACHED PRODUCTS ---\n';
        csvContent += 'Code,ProductName,Brands,Calories,Carbs,Fat,Protein,DefaultGrams\n';
        exportData.products.forEach((p: any) => {
          const prod = p.product;
          csvContent += `${p.code},"${(prod?.product_name || '').replace(/"/g, '""')}", "${(prod?.brands || '').replace(/"/g, '""')}", ${prod?.nutriments?.['energy-kcal_100g'] || 0}, ${prod?.nutriments?.carbohydrates_100g || 0}, ${prod?.nutriments?.fat_100g || 0}, ${prod?.nutriments?.proteins_100g || 0}, ${prod?.default_grams || ''}\n`;
        });
        csvContent += '\n';
      }

      if (exportData.favorites) {
        csvContent += '--- FAVORITES ---\n';
        csvContent += 'ProductCode\n';
        exportData.favorites.forEach((f: any) => {
          csvContent += `${f.code}\n`;
        });
        csvContent += '\n';
      }

      if (exportData.user_status) {
        csvContent += '--- USER STATUS ---\n';
        csvContent += 'Date,ExerciseCalories,BasalCalories,Steps,SleepHours,EnergyLevel,HungerLevel,Thoughts\n';
        exportData.user_status.forEach((s: any) => {
          csvContent += `${s.date},${s.exerciseCalories || 0},${s.basalCalories || 0},${s.steps || 0},${s.sleepHours || 0},${s.energyLevel || 0},${s.hungerLevel || 0},"${(s.thoughts || '').replace(/"/g, '""')}"\n`;
        });
      }

      return {
        content: csvContent,
        extension: 'csv'
      };
    }
  }

  async importData(data: any, override: boolean): Promise<number> {
    await this.ensureInit();
    let importedCount = 0;

    const storesMap: Record<string, string> = {
      'daily_consumption': STORE_NAME,
      'products': STORE_PRODUCTS,
      'favorites': STORE_FAVORITES,
      'meals': STORE_MEALS,
      'weight_history': STORE_WEIGHT_HISTORY,
      'user_status': STORE_USER_STATUS
    };

    const importBatches: Record<string, any[]> = {};

    for (const [dataKey, storeName] of Object.entries(storesMap)) {
      if (data[dataKey] && Array.isArray(data[dataKey])) {
        const itemsToPut: any[] = [];
        for (const item of data[dataKey]) {
          let shouldPut = true;

          if (!override) {
            if (dataKey === 'products') {
              const existing = await this.getCachedProduct(item.code);
              if (existing) shouldPut = false;
            } else if (dataKey === 'meals') {
              const existing = await this.getMeal(item.id);
              if (existing) shouldPut = false;
            } else if (dataKey === 'weight_history') {
              const history = await this.getWeightHistory();
              const existing = history.find(h => h.date === item.date);
              if (existing) shouldPut = false;
            } else if (dataKey === 'user_status') {
              const existing = await this.getUserStatusSummary(item.date);
              if (existing) shouldPut = false;
            }
          }

          if (shouldPut) {
            itemsToPut.push(item);
          }
        }
        if (itemsToPut.length > 0) {
          importBatches[storeName] = itemsToPut;
        }
      }
    }

    for (const [storeName, items] of Object.entries(importBatches)) {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const batchPromises = items.map(item => {
        return new Promise<void>((resolve, reject) => {
          const request = store.put(item);
          request.onsuccess = () => {
            importedCount++;
            resolve();
          };
          request.onerror = () => reject(request.error);
        });
      });

      await Promise.all(batchPromises);
    }

    if (data.user_profile) {
      localStorage.setItem('user_profile', JSON.stringify(data.user_profile));
      importedCount++;
    }

    return importedCount;
  }

  private async getUserStatusSummary(date: string): Promise<any | null> {
    await this.ensureInit();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_USER_STATUS], 'readonly');
      const store = transaction.objectStore(STORE_USER_STATUS);
      const request = store.get(date);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  private async _getAllFromStore(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }
}

export const dbService = new DBService();
