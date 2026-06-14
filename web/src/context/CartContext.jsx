import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  count: 0,
  subtotal: 0,
  loading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_CART':
      return { ...state, items: action.payload.items, count: action.payload.count, subtotal: action.payload.subtotal, loading: false };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size = '250g') => {
    await cartAPI.add(productId, quantity, size);
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    await cartAPI.update(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await cartAPI.remove(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
