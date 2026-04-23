import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Produto, ItemCarrinho, Tamanho } from '../types';
import { MULTIPLICADOR_TAMANHO, formatarPreco } from '../types';
import { ENV } from '../config/env.ts';

type CartContextType = {
  items: ItemCarrinho[];
  addToCart: (produto: Produto, quantidade: number, tamanho: Tamanho) => void;
  removeFromCart: (produtoId: string, tamanho: Tamanho) => void;
  updateQuantity: (produtoId: string, tamanho: Tamanho, quantidade: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceFormatted: string;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrinho[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(ENV.STORAGE_KEYS.CART_ITEMS);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch {
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(ENV.STORAGE_KEYS.CART_ITEMS, JSON.stringify(items));
      } catch {
      }
    };
    saveCart();
  }, [items, isLoaded]);

  const addToCart = useCallback((produto: Produto, quantidade: number, tamanho: Tamanho) => {
    setItems((prev) => {
      const existente = prev.find(
        (item) => item.produto.id === produto.id && item.tamanho === tamanho
      );

      if (existente) {
        return prev.map((item) =>
          item.produto.id === produto.id && item.tamanho === tamanho
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [...prev, { produto, quantidade, tamanho }];
    });
  }, []);

  const removeFromCart = useCallback((produtoId: string, tamanho: Tamanho) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.produto.id === produtoId && item.tamanho === tamanho)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (produtoId: string, tamanho: Tamanho, quantidade: number) => {
      if (quantidade <= 0) {
        removeFromCart(produtoId, tamanho);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.produto.id === produtoId && item.tamanho === tamanho
            ? { ...item, quantidade }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantidade, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.produto.preco * MULTIPLICADOR_TAMANHO[item.tamanho] * item.quantidade,
        0
      ),
    [items]
  );

  const totalPriceFormatted = useMemo(() => formatarPreco(totalPrice), [totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalPriceFormatted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
