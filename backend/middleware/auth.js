import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware для захисту роутів
export const protect = async (req, res, next) => {
  let token;

  // Токен передається в заголовку Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Верифікуємо токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Додаємо користувача до запиту (без паролю)
    req.user = await User.findById(decoded.id).select('-password -refreshTokens');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware для перевірки ролі admin
export const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
