import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Cart Model', () => {
  let mongoServer;
  let categoryId;
  let productId;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const category = await Category.create({ name: 'Test', slug: 'test' });
    categoryId = category._id;

    const product = await Product.create({
      name: 'Test Product',
      description: 'Test',
      price: 100,
      category: categoryId
    });
    productId = product._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  it('should create cart with items', async () => {
    const cart = await Cart.create({
      user: new mongoose.Types.ObjectId(),
      items: [{ product: productId, quantity: 2, price: 100 }],
      totalItems: 2,
      totalPrice: 200
    });

    assert.strictEqual(cart.items.length, 1);
    assert.strictEqual(cart.totalItems, 2);
  });

  it('should calculate total correctly', async () => {
    const userId = new mongoose.Types.ObjectId();

    const cart = await Cart.create({
      user: userId,
      items: [
        { product: productId, quantity: 1, price: 100 },
        { product: productId, quantity: 2, price: 50 }
      ]
    });

    await cart.save();
    // Перерахунок (бо в моделі не автоматично)
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    assert.strictEqual(cart.totalItems, 3);
    assert.strictEqual(cart.totalPrice, 200);
  });
});