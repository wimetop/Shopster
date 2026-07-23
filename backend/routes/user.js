import express from 'express';
import { register, login, getMe, refreshToken, logout, updateAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const authRouter = express.Router();

// Публічні роути
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);

// Захищені роути
authRouter.post('/logout', protect, logout);
authRouter.get('/me', protect, getMe);
authRouter.patch('/avatar', protect, uploadAvatar, updateAvatar);

export default authRouter;
