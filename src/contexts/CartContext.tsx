import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Produto, ItemCarrinho, MULTIPLICADOR_TAMANHO, formatarPreco } from '../data/mock';

type CartContextType = {
  items: ItemCarrinho[];
  addToCart: (produto: Produto, quantidade: number, tamanho: 'P' | 'M' | 'G') => void;
  removeFromCart: (produtoId: string, tamanho: 'P' | 'M' | 'G') => void;
  updateQuantity: (produtoId: string, tamanho: 'P' | 'M' | 'G', quantidade: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceFormatted: string;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrinho[]>([]);

  const addToCart = useCallback((produto: Produto, quantidade: number, tamanho: 'P' | 'M' | 'G') => {
    setItems(prev => {
      const existente = prev.find(
        item => item.produto.id === produto.id && item.tamanho === tamanho
      );

      if (existente) {
        return prev.map(item =>
          item.produto.id === produto.id && item.tamanho === tamanho
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [...prev, { produto, quantidade, tamanho }];
    });
  }, []);

  const removeFromCart = useCallback((produtoId: string, tamanho: 'P' | 'M' | 'G') => {
    setItems(prev => prev.filter(
      item => !(item.produto.id === produtoId && item.tamanho === tamanho)
    ));
  }, []);

  const updateQuantity = useCallback((produtoId: string, tamanho: 'P' | 'M' | 'G', quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId, tamanho);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.produto.id === produtoId && item.tamanho === tamanho
          ? { ...item, quantidade }
          : item
      )
    );
  }, [removeFromCart]);

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
