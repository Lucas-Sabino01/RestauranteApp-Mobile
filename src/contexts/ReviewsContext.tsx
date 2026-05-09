import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Review } from '../types';
import { ENV } from '../config/env';

type ReviewsContextData = {
  getReviews: (estabelecimentoId: string) => Review[];
  getUserReviews: () => Review[];
  addReview: (review: Review) => void;
  updateReview: (id: string, updatedData: Partial<Review>) => void;
  deleteReview: (id: string) => void;
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

  const getUserReviews = useCallback(() => {
    return reviews;
  }, [reviews]);

  const updateReview = useCallback((id: string, updatedData: Partial<Review>) => {
    setReviews((prev) => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updatedData } : r);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => {
      const updated = prev.filter(r => r.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  return (
    <ReviewsContext.Provider value={{ getReviews, getUserReviews, addReview, updateReview, deleteReview, userReviewCount: reviews.length }}>
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
