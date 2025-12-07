import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm.jsx';
import { registerUser } from './RegisterAPI.js';
import AppLogo from '../../components/AppLogo';

/**
 * RegisterPage - Container component for registration functionality
 * @param {Function} onAuthSuccess - Callback function called when authentication succeeds
 */
function RegisterPage({ onAuthSuccess }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Registration now requires a separate login, so onAuthSuccess is unused.
  void onAuthSuccess;

  const handleRegister = async (email, password, username) => {
    try {
      setError('');
      await registerUser(email, password, username);

      // אחרי הרשמה – מעבירים למסך התחברות
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gradientLayer} />
      <div style={styles.card}>
        <AppLogo align="center" size="lg" />

        <h2 style={styles.heading}>Create your account ✨</h2>
        <p style={styles.subheading}>
          Sign up to start organizing and tracking all your job applications.
        </p>

        <RegisterForm onSubmit={handleRegister} error={error} />

        {/* כפתור מעבר להתחברות */}
        <div style={styles.switchRow}>
          <span style={styles.switchText}>Already have an account?</span>
          <button
            type="button"
            style={styles.switchButton}
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
        </div>
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
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
  switchRow: {
    marginTop: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
  },
  switchText: {
    color: '#4b5563',
  },
  switchButton: {
    border: 'none',
    background: 'transparent',
    color: '#7c3aed',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '2px',
  },
};

export default RegisterPage;
