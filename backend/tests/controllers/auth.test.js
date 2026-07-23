import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Auth Controller Logic', () => {
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

  describe('User profile', () => {
    it('should return profile without password', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'profile@example.com',
        password: 'password123'
      });

      const profile = user.getProfile();
      assert.strictEqual(profile.name, 'Test User');
      assert.strictEqual(profile.email, 'profile@example.com');
      assert.strictEqual(profile.password, undefined);
      assert.strictEqual(profile.refreshTokens, undefined);
    });
  });
});