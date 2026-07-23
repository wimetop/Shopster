import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Генерація JWT токенів
const generateTokens = (user) => {
  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d' // 7 днів
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d' // 30 днів
  });

  return { accessToken, refreshToken };
};

// Реєстрація
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевірка чи існує користувач
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Створення користувача (пароль хешується в pre-save hook)
    const user = await User.create({ name, email, password });

    // Генеруємо токени
    const { accessToken, refreshToken } = generateTokens(user);

    // Зберігаємо refresh токен в базі
    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await user.save();

    res.status(201).json({
      user: user.getProfile(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Логін
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача (вибираємо пароль, бо в схемі select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Перевіряємо пароль
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Генеруємо токени
    const { accessToken, refreshToken } = generateTokens(user);

    // Зберігаємо refresh токен
    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await user.save();

    res.json({
      user: user.getProfile(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Отримати поточного користувача
export const getMe = async (req, res) => {
  res.json(req.user);
};

// Оновити access токен
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    // Верифікуємо refresh токен
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Шукаємо користувача
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Перевіряємо чи refresh токен існує в базі
    const storedToken = user.refreshTokens.find(
      t => t.token === refreshToken && t.expiresAt > new Date()
    );

    if (!storedToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Генеруємо нові токени
    const tokens = generateTokens(user);

    // Видаляємо старий refresh токен
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

    // Додаємо новий refresh токен
    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await user.save();

    res.json({
      user: user.getProfile(),
      ...tokens
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Оновити аватар
export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Якщо файл був завантажений, оновлюємо аватар
    if (req.file) {
      user.avatar = req.file.path; // Cloudinary повертає path з URL
    }

    await user.save();

    res.json({
      user: user.getProfile()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Логаут (видалення refresh токена)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findById(req.user.id);

    // Видаляємо refresh токен
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
