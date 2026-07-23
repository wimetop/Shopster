import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import express from 'express';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRouter from '../routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
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

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      assert.strictEqual(res.statusCode, 201);
      assert.ok(res.body.user);
      assert.ok(res.body.accessToken);
    });

    it('should not register user with existing email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        });

      assert.strictEqual(res.statusCode, 400);
    });
  });
});