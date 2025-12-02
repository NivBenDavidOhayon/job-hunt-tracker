// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_SECRET_CHANGE_ME';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer xxx"

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // מוודאים שמתאים לשינוי שעשינו – email+username
    req.user = {
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
