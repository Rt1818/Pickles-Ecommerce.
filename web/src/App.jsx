import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ToastContainer from './components/UI/Toast';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Shop from './pages/Shop/Shop';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Payment from './pages/Payment/Payment';
import Confirmation from './pages/Confirmation/Confirmation';
import Account from './pages/Account/Account';
import Track from './pages/Track/Track';

function AppLayout({ children, hideNav }) {
  return (
    <>
      {!hideNav && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideNav && <Footer />}
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Prevent scrollbars and layout shifts while splash screen is active
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setShowSplash(false);
      document.body.style.overflow = 'unset';
    }, 2200); // Display splash screen for 2.2 seconds

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AnimatePresence>
              {showSplash && (
                <motion.div
                  key="splash"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'linear-gradient(135deg, #ffe4ef 0%, #ebdced 50%, #dcf0e3 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <motion.img
                      src="/logo.png"
                      alt="Shanti Pickles Logo"
                      style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '40px',
                        boxShadow: 'var(--shadow-lg)',
                        backgroundColor: '#ffffff',
                        padding: '16px',
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    />
                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginTop: '24px',
                      }}
                    >
                      Shanti Pickles
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        letterSpacing: '3px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                      }}
                    >
                      Pure • Homely • Peaceful
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <ToastContainer />
            <Routes>
              {/* Login has its own layout (no header/footer) */}
              <Route path="/login" element={<AppLayout hideNav><Login /></AppLayout>} />

              {/* All other pages have header/footer */}
              <Route path="/" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/shop" element={<AppLayout><Shop /></AppLayout>} />
              <Route path="/product/:slug" element={<AppLayout><Product /></AppLayout>} />
              <Route path="/cart" element={<AppLayout><Cart /></AppLayout>} />
              <Route path="/checkout" element={<AppLayout><Checkout /></AppLayout>} />
              <Route path="/payment" element={<AppLayout><Payment /></AppLayout>} />
              <Route path="/confirmation" element={<AppLayout><Confirmation /></AppLayout>} />
              <Route path="/account" element={<AppLayout><Account /></AppLayout>} />
              <Route path="/track/:id" element={<AppLayout><Track /></AppLayout>} />

              {/* 404 */}
              <Route path="*" element={
                <AppLayout>
                  <div className="section container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: 16 }}>404</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Page not found</p>
                    <Link to="/" style={{ color: 'var(--brand-amber)', fontWeight: 700 }}>← Go Home</Link>
                  </div>
                </AppLayout>
              } />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
