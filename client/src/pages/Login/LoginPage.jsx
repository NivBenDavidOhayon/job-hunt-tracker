import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm.jsx';
import { loginUser } from './LoginAPI.js';

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
      
      // Call the API function
      const response = await loginUser(email, password);
      
      // Extract token from response
      const token = response.token || response.data?.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Call onAuthSuccess prop to update app state
      if (onAuthSuccess) {
        onAuthSuccess(token);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
}

export default LoginPage;

