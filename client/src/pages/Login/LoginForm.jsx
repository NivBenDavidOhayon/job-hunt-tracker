import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * LoginForm - Presentational component for the login form
 * @param {Function} onSubmit - Callback function called when form is submitted
 * @param {string} error - Error message to display
 */
function LoginForm({ onSubmit, error: externalError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    // Call the onSubmit prop function
    onSubmit(email, password);
  };

  const error = externalError || localError;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Login</h2>
      
      {error && (
        <div style={styles.error}>{error}</div>
      )}

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="password" style={styles.label}>
          Password:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" style={styles.button}>
        Login
      </button>

      <p style={styles.helperText}>
        עדיין אין לך חשבון?{' '}
        <Link to="/register" style={styles.link}>
          הירשם
        </Link>
      </p>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#646cff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.25s',
  },
  error: {
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    border: '1px solid #fcc',
  },
  helperText: {
    marginTop: '1rem',
    textAlign: 'center',
    color: '#555',
  },
  link: {
    color: '#646cff',
    fontWeight: '600',
  },
};

export default LoginForm;

