import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteCity } from "@/types/geocoding";

interface FavoritesStore {
  favorites: FavoriteCity[];
  currentCity: FavoriteCity | null;
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (id: string) => void;
  setCurrentCity: (city: FavoriteCity) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      currentCity: null,
      addFavorite: (city) =>
        set((state) => {
          if (state.favorites.some((f) => f.id === city.id)) return state;
          return { favorites: [...state.favorites, city] };
        }),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      setCurrentCity: (city) => set({ currentCity: city }),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    { name: "stormscope-favorites" },
  ),
);
