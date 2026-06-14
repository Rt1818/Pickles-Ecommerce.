import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setOtpSent(true);
    clearError();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await login('demo@shantipickles.com', 'demo1234');
      navigate('/shop');
    } catch {}
  };

  const handleGoogleLogin = async () => {
    try {
      await login('demo@shantipickles.com', 'demo1234');
      navigate('/shop');
    } catch {}
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/shop');
    } catch {}
  };

  return (
    <div className={styles.page}>
      {/* Left — Branding Panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <Link to="/" className={styles.backLink}>← Back to Home</Link>
          <div className={styles.brandLogo}>
            <img src="/logo.png" alt="Shanti Pickles Logo" />
          </div>
          <h1>Shanti Pickles <span className="text-gradient">& Foods</span></h1>
          <p>Authentic Telugu pickles and snacks, delivered to your door. Pure ingredients, traditional taste.</p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}>
              <span>🌿</span>
              <span>Preservative Free</span>
            </div>
            <div className={styles.brandFeature}>
              <span>🏠</span>
              <span>Homemade with Love</span>
            </div>
            <div className={styles.brandFeature}>
              <span>🚀</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
        <div className={styles.brandGlow} />
      </div>

      {/* Right — Auth Form */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loginMethod}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2>Welcome Back</h2>
              <p className={styles.subtitle}>Sign in to your Shanti Pickles account</p>

              {error && (
                <motion.div className={styles.errorBox} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  ❌ {error}
                </motion.div>
              )}

              {loginMethod === 'phone' ? (
                <div className={styles.formWrap}>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label>Mobile Number</label>
                        <div className={styles.phoneInputWrap}>
                          <span className={styles.phonePrefix}>+91</span>
                          <input 
                            type="tel" 
                            className={styles.input} 
                            placeholder="10-digit mobile number" 
                            maxLength={10} 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                            required 
                            autoFocus
                          />
                        </div>
                      </div>
                      <button type="submit" className={styles.submitBtn} disabled={phone.length < 10 || loading}>
                        Get OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label>Enter OTP sent to +91 {phone}</label>
                        <input 
                          type="text" 
                          className={styles.input} 
                          placeholder="Enter 4-digit OTP" 
                          maxLength={4} 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                          required 
                          autoFocus
                        />
                        <button type="button" className={styles.editPhoneBtn} onClick={() => setOtpSent(false)}>Edit Phone Number</button>
                      </div>
                      <button type="submit" className={styles.submitBtn} disabled={otp.length < 4 || loading}>
                        {loading ? <span className={styles.spinner} /> : 'Verify & Login'}
                      </button>
                    </form>
                  )}

                  <div className={styles.divider}><span>OR</span></div>

                  <button className={styles.googleBtn} onClick={handleGoogleLogin} type="button">
                    <span className={styles.googleIcon}>G</span> Continue with Google
                  </button>

                  <button className={styles.switchModeBtn} onClick={() => { setLoginMethod('email'); clearError(); }} type="button">
                    Continue with Email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailLogin} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input type="email" className={styles.input} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Password</label>
                    <input type="password" className={styles.input} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? <span className={styles.spinner} /> : 'Sign In with Email'}
                  </button>

                  <button className={styles.switchModeBtn} onClick={() => { setLoginMethod('phone'); clearError(); }} type="button">
                    Back to Phone Login
                  </button>

                  <div className={styles.demoBox}>
                    <p>🧪 <strong>Demo credentials:</strong></p>
                    <code>demo@shantipickles.com / demo1234</code>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
