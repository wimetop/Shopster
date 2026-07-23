import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Category from '../../models/Category.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Category Model', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should create a category', async () => {
    const category = new Category({
      name: 'Electronics',
      slug: 'electronics'
    });
    await category.save();

    assert.strictEqual(category.name, 'Electronics');
    assert.strictEqual(category.slug, 'electronics');
  });

  it('should require name field', async () => {
    const category = new Category({});
    await assert.rejects(category.save(), {
      message: /Category name is required/
    });
  });
});