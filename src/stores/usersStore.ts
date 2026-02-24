/**
 * Users Store (Zustand)
 * 
 * CACHING STRATEGY:
 * - We cache fetched user lists by a composite key (page + search query)
 * - Individual user details are cached by user ID
 * - This avoids redundant API calls when navigating back/forth
 * - Cache is stored in memory (Zustand state) — clears on page refresh
 */

import { create } from 'zustand';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  image: string;
  username: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  company: {
    name: string;
    department: string;
    title: string;
  };
}

interface UsersState {
  users: User[];
  total: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search: string;
  selectedUser: User | null;
  selectedUserLoading: boolean;
  // Cache: key = "page-search" => users array
  cache: Record<string, { users: User[]; total: number }>;
  userCache: Record<number, User>;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  clearSelectedUser: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  isLoading: false,
  error: null,
  page: 0,
  limit: 10,
  search: '',
  selectedUser: null,
  selectedUserLoading: false,
  cache: {},
  userCache: {},

  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 0 }),

  fetchUsers: async () => {
    const { page, limit, search, cache } = get();
    const cacheKey = `${page}-${search}`;

    // Return cached data if available
    if (cache[cacheKey]) {
      set({ users: cache[cacheKey].users, total: cache[cacheKey].total });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const skip = page * limit;
      const url = search
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      const res = await fetch(url);
      const data = await res.json();

      // Update cache
      const newCache = { ...cache, [cacheKey]: { users: data.users, total: data.total } };
      set({ users: data.users, total: data.total, isLoading: false, cache: newCache });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchUserById: async (id: number) => {
    const { userCache } = get();

    // Return cached user if available
    if (userCache[id]) {
      set({ selectedUser: userCache[id], selectedUserLoading: false });
      return;
    }

    set({ selectedUserLoading: true, selectedUser: null });
    try {
      const res = await fetch(`https://dummyjson.com/users/${id}`);
      const data = await res.json();
      set({
        selectedUser: data,
        selectedUserLoading: false,
        userCache: { ...userCache, [id]: data },
      });
    } catch (err: any) {
      set({ error: err.message, selectedUserLoading: false });
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
}));
