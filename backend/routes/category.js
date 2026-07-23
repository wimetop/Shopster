import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadCategoryImage } from '../middleware/upload.js';

const categoryRouter = express.Router();

// Публічні роути
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', getCategoryById);

// Захищені роути (тільки admin)
categoryRouter.post('/', protect, admin, uploadCategoryImage, createCategory);
categoryRouter.put('/:id', protect, admin, uploadCategoryImage, updateCategory);
categoryRouter.patch('/:id', protect, admin, uploadCategoryImage, updateCategory);
categoryRouter.delete('/:id', protect, admin, deleteCategory);

export default categoryRouter;
