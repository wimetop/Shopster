import express from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview,
  getReviews,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const reviewRouter = express.Router();

// Public routes
reviewRouter.get('/product/:productId', getProductReviews);

// Protected routes (authenticated users)
reviewRouter.post('/', protect, createReview);
reviewRouter.delete('/:id', protect, deleteReview);

// Admin routes
reviewRouter.get('/', protect, admin, getReviews);

export default reviewRouter;