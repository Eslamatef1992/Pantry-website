import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    setCart(res.data);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    setCart(res.data);
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
