import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const cartRouter = express.Router();

// Захищені роути (тільки авторизовані)
cartRouter.get('/', protect, getCart);
cartRouter.post('/', protect, addToCart);
cartRouter.put('/item', protect, updateCartItem);
cartRouter.delete('/item/:itemId', protect, removeFromCart);
cartRouter.delete('/', protect, clearCart);

export default cartRouter;
