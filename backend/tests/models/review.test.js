import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Review from '../../models/Review.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import User from '../../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Review Model', () => {
  let mongoServer;
  let categoryId;
  let productId;
  let userId;

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

    const user = await User.create({
      name: 'Review User',
      email: 'review@example.com',
      password: 'password123'
    });
    userId = user._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
  });

  it('should create review with rating', async () => {
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: 5,
      comment: 'Great product!'
    });

    assert.strictEqual(review.rating, 5);
    assert.strictEqual(review.comment, 'Great product!');
  });

  it('should require rating between 1-5', async () => {
    const review = new Review({
      user: userId,
      product: productId,
      rating: 10, // Invalid
      comment: 'Test'
    });

    await assert.rejects(review.save(), {
      message: /Rating cannot exceed 5/
    });
  });

  it('should prevent duplicate reviews', async () => {
    await Review.create({
      user: userId,
      product: productId,
      rating: 4,
      comment: 'Good'
    });

    const duplicate = new Review({
      user: userId,
      product: productId,
      rating: 5,
      comment: 'Duplicate'
    });

    // Due to unique index on { user: 1, product: 1 }
    await assert.rejects(duplicate.save());
  });
});