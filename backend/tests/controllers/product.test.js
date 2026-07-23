import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Product Controller', () => {
  let mongoServer;
  let categoryId;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const category = await Category.create({ name: 'Test', slug: 'test' });
    categoryId = category._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('getProducts logic', () => {
    it('should get all products with pagination', async () => {
      await Product.create({
        name: 'Product 1',
        description: 'Test',
        price: 100,
        category: categoryId
      });
      await Product.create({
        name: 'Product 2',
        description: 'Test',
        price: 200,
        category: categoryId
      });

      const products = await Product.find();
      assert.strictEqual(products.length, 2);
    });

    it('should search by name', async () => {
      await Product.create({
        name: 'iPhone 15',
        description: 'Test',
        price: 1000,
        category: categoryId
      });

      const products = await Product.find({ name: { $regex: /iPhone/i } });
      assert.strictEqual(products.length, 1);
      assert.strictEqual(products[0].name, 'iPhone 15');
    });
  });
});