import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Delivery fee logic
  const DELIVERY_FEE = cart.totalAmount >= 499 ? 0 : 40;
  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalAmount: 0 }); return; }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data);
    } catch { setCart({ items: [], totalAmount: 0 }); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { error: "Please login to add items to cart" };
    try {
      const res = await cartAPI.add({ productId, quantity });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.message || "Failed to add to cart" };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartAPI.update(productId, { quantity });
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.remove(productId);
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], totalAmount: 0 });
    } catch (err) { console.error(err); }
  };

  return (
    <CartContext.Provider value={{
      cart, cartCount, loading, DELIVERY_FEE,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
