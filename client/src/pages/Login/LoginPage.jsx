import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm.jsx';
import { loginUser } from './LoginAPI.js';
import AppLogo from '../../components/AppLogo';

/**
 * LoginPage - Container component for login functionality
 * @param {Function} onAuthSuccess - Callback function called when authentication succeeds
 */
function LoginPage({ onAuthSuccess }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setError('');

      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      }
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gradientLayer} />
      <div style={styles.card}>
        <AppLogo align="center" size="lg" />

        <h2 style={styles.heading}>Welcome back 👋</h2>
        <p style={styles.subheading}>
          Log in to track your job hunt, applications and interviews.
        </p>

        {/* הטופס עצמו כבר מטפל בשדות ובשגיאה דרך ה־prop error */}
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'radial-gradient(circle at top, #f3e8ff 0, #fdf2ff 40%, #fefefe 100%)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  gradientLayer: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    background:
      'radial-gradient(600px at top left, rgba(129, 140, 248, 0.30), transparent 60%), radial-gradient(600px at bottom right, rgba(236, 72, 153, 0.25), transparent 60%)',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    padding: '2.25rem 2rem',
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.20)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(148,163,184,0.25)',
  },
  heading: {
    margin: '1.2rem 0 0.3rem',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#1f2933',
    textAlign: 'center',
  },
  subheading: {
    margin: '0 0 1.5rem',
    fontSize: '0.9rem',
    color: '#6b21a8',
    opacity: 0.9,
    textAlign: 'center',
  },
};

export default LoginPage;
