import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('User Model', () => {
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

  it('should hash password before save', async () => {
    const user = new User({
      name: 'Test User',
      email: 'hash@example.com',
      password: 'password123'
    });
    await user.save();

    const savedUser = await User.findOne({ email: 'hash@example.com' }).select('+password');
    assert.ok(savedUser.password.startsWith('$2'));
    assert.notStrictEqual(savedUser.password, 'password123');
  });

  it('should compare password correctly', async () => {
    const user = new User({
      name: 'Compare User',
      email: 'compare@example.com',
      password: 'password123'
    });
    await user.save();

    const savedUser = await User.findOne({ email: 'compare@example.com' }).select('+password');
    const isMatch = await savedUser.comparePassword('password123');
    assert.strictEqual(isMatch, true);

    const isWrongMatch = await savedUser.comparePassword('wrongpassword');
    assert.strictEqual(isWrongMatch, false);
  });
});