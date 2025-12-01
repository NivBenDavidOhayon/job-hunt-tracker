import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../prismaClient.js';

dotenv.config();

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or malformed.' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid token: User not found.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: User not found.' });
    }

    req.user = { id: user.id, email: user.email };
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;

