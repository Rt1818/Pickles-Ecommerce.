import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

let initialUser = null;
try {
  const storedUser = localStorage.getItem('sp_user');
  if (storedUser && storedUser !== 'undefined') {
    initialUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error('Failed to parse user from localStorage:', e);
}

const initialState = {
  user: initialUser,
  token: localStorage.getItem('sp_token') || null,
  isAuthenticated: !!localStorage.getItem('sp_token'),
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, isAuthenticated: true, error: null };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount
  useEffect(() => {
    if (state.token && !state.user) {
      authAPI.getMe()
        .then(res => dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data.user, token: state.token } }))
        .catch(() => dispatch({ type: 'LOGOUT' }));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('sp_token', state.token);
      localStorage.setItem('sp_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('sp_token');
      localStorage.removeItem('sp_user');
    }
  }, [state.token, state.user]);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await authAPI.login(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      throw new Error(msg);
    }
  };

  const signup = async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await authAPI.signup(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      throw new Error(msg);
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
