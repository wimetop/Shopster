import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const userRouter = express.Router();

// Admin routes (all protected)
userRouter.get('/', protect, admin, getUsers);
userRouter.get('/:id', protect, admin, getUserById);
userRouter.put('/:id', protect, admin, updateUser);
userRouter.patch('/:id', protect, admin, updateUser);
userRouter.delete('/:id', protect, admin, deleteUser);

export default userRouter;