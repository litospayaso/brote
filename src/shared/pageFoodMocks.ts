/* eslint-disable @typescript-eslint/no-explicit-any */
export const createMockDbWithProduct = (): any => ({
  init: () => Promise.resolve(),
  isFavorite: (_code: string) => Promise.resolve(false),
  getCachedProduct: (_code: string) => Promise.resolve(null),
  cacheProduct: () => Promise.resolve(),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getMeal: (_id: string) => Promise.resolve({ id: 'meal1', name: 'Test Meal', foods: [] }),
  saveMeal: () => Promise.resolve(),
  addFoodItem: () => Promise.resolve(),
  updateProductInMeals: () => Promise.resolve(),
  updateProductInLogs: () => Promise.resolve()
});

export const mockProductData = {
  code: '123',
  product: {
    product_name: 'Test Food',
    brands: 'Test Brand',
    nutriments: {
      'energy-kcal_100g': 100,
      carbohydrates_100g: 10,
      proteins_100g: 5,
      'fat_100g': 2
    }
  }
};

export const mockProductDataWithDefaultGrams = {
  code: '123',
  product: {
    product_name: 'Test Food',
    brands: 'Test Brand',
    default_grams: 150,
    nutriments: {
      'energy-kcal_100g': 100,
      carbohydrates_100g: 10,
      proteins_100g: 5,
      'fat_100g': 2
    }
  }
};

export const mockCachedProduct = {
  code: '123',
  product: {
    product_name: 'Cached Product',
    brands: 'Test Brand',
    default_grams: 150,
    nutriments: {
      'energy-kcal_100g': 200,
      carbohydrates_100g: 30,
      proteins_100g: 10,
      'fat_100g': 5
    }
  }
};

export const mockMeal = {
  id: 'meal1',
  name: 'Test Meal',
  foods: []
};
