/**
 * Products Store (Zustand)
 * 
 * CACHING STRATEGY:
 * - Product lists are cached by composite key (page + search + category)
 * - Individual product details cached by product ID
 * - Categories fetched once and cached permanently in state
 * - Avoids unnecessary re-fetches for previously viewed data
 */

import { create } from 'zustand';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
}

interface Category {
  slug: string;
  name: string;
  url: string;
}

interface ProductsState {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search: string;
  category: string;
  categories: Category[];
  categoriesLoading: boolean;
  selectedProduct: Product | null;
  selectedProductLoading: boolean;
  cache: Record<string, { products: Product[]; total: number }>;
  productCache: Record<number, Product>;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  clearSelectedProduct: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  isLoading: false,
  error: null,
  page: 0,
  limit: 12,
  search: '',
  category: '',
  categories: [],
  categoriesLoading: false,
  selectedProduct: null,
  selectedProductLoading: false,
  cache: {},
  productCache: {},

  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 0, category: '' }),
  setCategory: (category) => set({ category, page: 0, search: '' }),

  fetchProducts: async () => {
    const { page, limit, search, category, cache } = get();
    const cacheKey = `${page}-${search}-${category}`;

    if (cache[cacheKey]) {
      set({ products: cache[cacheKey].products, total: cache[cacheKey].total });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const skip = page * limit;
      let url: string;

      if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const newCache = { ...cache, [cacheKey]: { products: data.products, total: data.total } };
      set({ products: data.products, total: data.total, isLoading: false, cache: newCache });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    const { categories } = get();
    if (categories.length > 0) return; // Already fetched

    set({ categoriesLoading: true });
    try {
      const res = await fetch('https://dummyjson.com/products/categories');
      const data = await res.json();
      set({ categories: data, categoriesLoading: false });
    } catch (err: any) {
      set({ categoriesLoading: false });
    }
  },

  fetchProductById: async (id: number) => {
    const { productCache } = get();

    if (productCache[id]) {
      set({ selectedProduct: productCache[id], selectedProductLoading: false });
      return;
    }

    set({ selectedProductLoading: true, selectedProduct: null });
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await res.json();
      set({
        selectedProduct: data,
        selectedProductLoading: false,
        productCache: { ...productCache, [id]: data },
      });
    } catch (err: any) {
      set({ error: err.message, selectedProductLoading: false });
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
