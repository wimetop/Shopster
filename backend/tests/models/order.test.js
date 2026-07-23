import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Order Model', () => {
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
    await Order.deleteMany({});
  });

  it('should create order with correct total', async () => {
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(),
      orderItems: [
        { product: productId, name: 'Product', quantity: 2, price: 100, image: 'test.jpg' }
      ],
      shippingAddress: {
        fullName: 'Test',
        address: 'Test Address',
        city: 'Kyiv',
        postalCode: '01001',
        phone: '+380'
      },
      itemsPrice: 200,
      shippingPrice: 50,
      totalPrice: 250,
      orderNumber: 'ORD-001'
    });

    assert.strictEqual(order.totalPrice, 250);
    assert.strictEqual(order.orderItems.length, 1);
  });

  it('should have default status new', async () => {
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(),
      orderItems: [{ product: productId, name: 'Test', quantity: 1, price: 0, image: 'test.jpg' }],
      shippingAddress: {
        fullName: 'Test',
        address: 'Test',
        city: 'Kyiv',
        postalCode: '01001',
        phone: '+380'
      },
      itemsPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      orderNumber: 'ORD-002'
    });

    assert.strictEqual(order.status, 'new');
    assert.strictEqual(order.isPaid, false);
  });
});