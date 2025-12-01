import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm.jsx';
import { registerUser } from './RegisterAPI.js';

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
      
      // Call the API function
      await registerUser(email, password, username);

      // After successful registration, direct the user to log in
      navigate('/login', { state: { registered: true, email } });
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  );
}

export default RegisterPage;

