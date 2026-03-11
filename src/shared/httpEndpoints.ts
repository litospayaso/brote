/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductInterface, SearchProductInterface, SearchProductItemInterface } from './http.interfaces';
import { request } from './httpRequest';


let cachedPopularProducts: { [lang: string]: string[] } = {};

export const getProduct = async (barcode: string): Promise<ProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';
  const response = await request(`api/v3/product/${barcode}?product_type=food&cc=${lang}&lc=${lang}&fields=brands,nutriments,product_name,product_name_${lang},product_name_en&knowledge_panel_client=web&activate_knowledge_panels_simplified=true&activate_knowledge_panel_physical_activities=false&knowledge_panels_included=nutriments&knowledge_panels_excluded=+allergens_hierarchy&blame=0`);
  return response;
};

export const searchProduct = async (query: string): Promise<SearchProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';

  if (!cachedPopularProducts[lang]) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/litospayaso/brote/refs/heads/main/assets/data/popular_${lang}.json`);
      if (response.ok) {
        cachedPopularProducts[lang] = await response.json();
      } else {
        cachedPopularProducts[lang] = [];
      }
    } catch (error) {
      console.error(`Error fetching popular products for ${lang}:`, error);
      cachedPopularProducts[lang] = [];
    }
  }

  const popularProducts = cachedPopularProducts[lang];
  const lowerQuery = query.toLowerCase();

  const filtered = popularProducts.filter(item => item.toLowerCase().includes(lowerQuery));

  const products: SearchProductItemInterface[] = filtered.slice(0, 35).map(item => {
    const parts = item.split(' :: ');
    const code = parts[0];
    const rest = parts[1] || '';
    const lastDashIndex = rest.lastIndexOf(' - ');

    let productName = rest;
    let brands = '';

    if (lastDashIndex !== -1) {
      productName = rest.substring(0, lastDashIndex);
      brands = rest.substring(lastDashIndex + 3);
    }

    return {
      code,
      product_name: productName,
      brands: brands,
      nutriments: {} as any,
      nutrition_data: '',
      nutrition_data_per: '',
      nutrition_data_prepared_per: ''
    };
  });

  return {
    count: filtered.length,
    page: 1,
    page_count: Math.ceil(filtered.length / 35),
    page_size: 35,
    skip: 0,
    products
  };
};
