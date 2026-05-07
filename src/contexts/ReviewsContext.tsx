import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Review } from '../types';
import { ENV } from '../config/env';

type ReviewsContextData = {
  getReviews: (estabelecimentoId: string) => Review[];
  addReview: (review: Review) => void;
  userReviewCount: number;
};

const ReviewsContext = createContext<ReviewsContextData>({} as ReviewsContextData);

const STORAGE_KEY = '@GuiaCuritiba:userReviews';

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setReviews(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const persist = useCallback(async (data: Review[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviews((prev) => {
      const updated = [review, ...prev];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const getReviews = useCallback((estabelecimentoId: string) => {
    return reviews.filter((r) => r.estabelecimentoId === estabelecimentoId);
  }, [reviews]);

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview, userReviewCount: reviews.length }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews deve ser usado dentro de um ReviewsProvider');
  }
  return context;
}
