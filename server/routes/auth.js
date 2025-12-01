import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../prismaClient.js';

dotenv.config();

const router = express.Router();
const { JWT_SECRET } = process.env;

const buildAuthResponse = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: buildAuthResponse(user),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'User already exists' });
    }
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      user: buildAuthResponse(user),
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

export default router;

