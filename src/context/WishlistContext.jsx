import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const GUEST_WISHLIST_KEY = 'guestWishlist';

const loadGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveGuestWishlist = (wishlist) => {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(loadGuestWishlist());
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      const items = res.data.map((row) => ({ id: row.productId, productId: row.productId, product: row.product }));
      setWishlist({ items });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId) => wishlist.items.some((i) => i.productId === productId);

  // product: the full product object, so guest wishlists can render without another API call
  const addToWishlist = async (product) => {
    if (!user) {
      const current = loadGuestWishlist();
      if (current.items.some((i) => i.productId === product.id)) return;
      const next = { items: [...current.items, { id: product.id, productId: product.id, product }] };
      saveGuestWishlist(next);
      setWishlist(next);
      return;
    }
    const res = await api.post('/wishlist', { productId: product.id });
    setWishlist((prev) => ({
      items: [...prev.items.filter((i) => i.productId !== product.id), { id: res.data.productId, productId: res.data.productId, product: res.data.product }],
    }));
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      const current = loadGuestWishlist();
      const next = { items: current.items.filter((i) => i.productId !== productId) };
      saveGuestWishlist(next);
      setWishlist(next);
      return;
    }
    await api.delete(`/wishlist/${productId}`);
    setWishlist((prev) => ({ items: prev.items.filter((i) => i.productId !== productId) }));
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const wishlistCount = wishlist.items.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount, isGuest: !user }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
