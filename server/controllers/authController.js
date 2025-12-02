// server/controllers/authController.js
const authService = require('../services/authService');

async function register(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await authService.registerUser({ email, password, username });
    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (err) {
    console.error('Register error:', err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { token, user } = await authService.authenticateUser({ email, password });
    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Server error' });
  }
}

module.exports = {
  register,
  login,
};

