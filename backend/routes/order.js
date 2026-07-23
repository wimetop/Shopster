import express from 'express';
import {
  getMyOrders,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const orderRouter = express.Router();

// User routes
orderRouter.get('/my', protect, getMyOrders);
orderRouter.get('/:id', protect, getOrderById);
orderRouter.post('/', protect, createOrder);

// Admin routes
orderRouter.get('/', protect, admin, getOrders);
orderRouter.put('/:id/status', protect, admin, updateOrderStatus);

export default orderRouter;