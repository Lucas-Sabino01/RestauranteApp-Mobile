import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env.ts';

type FavoritesContextType = {
  favorites: string[];
  isFavorite: (produtoId: string) => boolean;
  toggleFavorite: (produtoId: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(ENV.STORAGE_KEYS.FAVORITES);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch {
      }
    };
    loadFavorites();
  }, []);
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(ENV.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      } catch {
      }
    };
    saveFavorites();
  }, [favorites]);

  const isFavorite = useCallback(
    (produtoId: string) => favorites.includes(produtoId),
    [favorites]
  );

  const toggleFavorite = useCallback((produtoId: string) => {
    setFavorites((prev) =>
      prev.includes(produtoId)
        ? prev.filter((id) => id !== produtoId)
        : [...prev, produtoId]
    );
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
