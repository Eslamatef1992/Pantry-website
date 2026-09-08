import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'guestCart';

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(loadGuestCart());
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

  // product: the full product object (not just an id) so guest carts can render without another API call
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      const current = loadGuestCart();
      const existing = current.items.find((i) => i.productId === product.id);
      const items = existing
        ? current.items.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i))
        : [...current.items, { id: product.id, productId: product.id, quantity, product }];
      const next = { items };
      saveGuestCart(next);
      setCart(next);
      return;
    }
    const res = await api.post('/cart/items', { productId: product.id, quantity });
    setCart(res.data);
  };

  const updateItem = async (itemId, quantity) => {
    if (!user) {
      const current = loadGuestCart();
      const items =
        quantity > 0
          ? current.items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
          : current.items.filter((i) => i.id !== itemId);
      const next = { items };
      saveGuestCart(next);
      setCart(next);
      return;
    }
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    if (!user) {
      const current = loadGuestCart();
      const next = { items: current.items.filter((i) => i.id !== itemId) };
      saveGuestCart(next);
      setCart(next);
      return;
    }
    const res = await api.delete(`/cart/items/${itemId}`);
    setCart(res.data);
  };

  const clearGuestCart = () => {
    saveGuestCart({ items: [] });
    setCart({ items: [] });
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateItem, removeItem, refreshCart, clearGuestCart, itemCount, isGuest: !user }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
