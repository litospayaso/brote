/* eslint-disable @typescript-eslint/no-explicit-any */
export const createMockEmptyDb = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(undefined),
  isFavorite: () => Promise.resolve(false),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithCache = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([{ product_name: 'Cached Product', code: '123' }]),
  getFavorites: () => Promise.resolve([{ code: '456' }]),
  getCachedProduct: (_code: string) => Promise.resolve({ product_name: 'Favorite Product', code: '456' }),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithFavorites = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  cacheProduct: () => Promise.resolve(),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithMeals = (): any => ({
  init: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([
    { 
      id: 'meal1', 
      name: 'Breakfast', 
      foods: [
        { product: { nutriments: { 'energy-kcal': 100 } }, quantity: 100 }
      ]
    },
    { id: 'meal2', name: 'Lunch', foods: [] }
  ]),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false)
});

export const createMockDbWithFavoritesAndMeals = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([{ code: 'fav1' }]),
  getCachedProduct: () => Promise.resolve(null),
  getAllMeals: () => Promise.resolve([
    { id: 'fav1', name: 'Favorite Meal', foods: [] }
  ]),
  isFavorite: () => Promise.resolve(true)
});

export const createMockDbRemoveFavorite = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(true),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithFilterEmpty = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([{ product_name: 'Apple', code: '1' }]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithCachedProduct = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([{ product_name: 'Product', code: '1' }]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithAppleAndBanana = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([
    { product_name: 'Apple', code: '1' },
    { product_name: 'Banana', code: '2' }
  ]),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbEmptyCache = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithMealId = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([{ product_name: 'Product', code: '1' }]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbEmptyCacheWithMealId = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});

export const createMockDbWithBarcode = (): any => ({
  init: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(null),
  isFavorite: () => Promise.resolve(false),
  getAllMeals: () => Promise.resolve([])
});
