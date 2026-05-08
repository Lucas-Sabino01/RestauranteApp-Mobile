import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import type { Reserva } from '../types';

type ReservationsContextType = {
  reservations: Reserva[];
  addReservation: (reserva: Reserva) => void;
  cancelReservation: (id: string) => void;
  getActiveReservations: () => Reserva[];
  reservationCount: number;
};

const ReservationsContext = createContext<ReservationsContextType | null>(null);

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error('useReservations deve ser usado dentro de ReservationsProvider');
  }
  return context;
};

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const stored = await AsyncStorage.getItem(ENV.STORAGE_KEYS.RESERVATIONS);
        if (stored) {
          setReservations(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('[ReservationsContext] Erro ao carregar reservas:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadReservations();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveReservations = async () => {
      try {
        await AsyncStorage.setItem(ENV.STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      } catch (err) {
        console.warn('[ReservationsContext] Erro ao salvar reservas:', err);
      }
    };
    saveReservations();
  }, [reservations, isLoaded]);

  const addReservation = useCallback((reserva: Reserva) => {
    setReservations((prev) => [reserva, ...prev]);
  }, []);

  const cancelReservation = useCallback((id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelada' as const } : r))
    );
  }, []);

  const getActiveReservations = useCallback(
    () => reservations.filter((r) => r.status === 'confirmada'),
    [reservations]
  );

  const reservationCount = reservations.filter((r) => r.status === 'confirmada').length;

  return (
    <ReservationsContext.Provider
      value={{ reservations, addReservation, cancelReservation, getActiveReservations, reservationCount }}
    >
      {children}
    </ReservationsContext.Provider>
  );
};
