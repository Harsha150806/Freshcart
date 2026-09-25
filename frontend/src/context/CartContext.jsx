import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setCartLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err.message);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      setCart(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [] });
    } catch (err) {
      console.error('Failed to clear cart:', err.message);
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartTotal = cart?.items?.reduce(
    (sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity,
    0
  ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        cartLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
