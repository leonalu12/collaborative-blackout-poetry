const request = require('supertest');
const { app } = require('../server');
const User = require('../../models/User');

describe('Auth API - Signup and Login', () => {
  beforeEach(async () => {
    // Clean DB before each test
    await User.deleteMany({});
  });

  // Test signup
  it('should signup a new user and return token and user data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'TestUser', email: 'testuser@example.com', password: 'securepass123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'TestUser',
      email: 'testuser@example.com'
    });
  });

  // Test login with correct credentials
  it('should login an existing user with correct credentials', async () => {
    // First create the user
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'LoginUser', email: 'login@example.com', password: 'mypassword' });

    // Then log in
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'mypassword' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'LoginUser',
      email: 'login@example.com'
    });
  });

  // Test login with wrong password
  it('should not login with incorrect password', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'FailUser', email: 'fail@example.com', password: 'correctpass' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fail@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  // Test login with non-existing user
  it('should not login if user does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'ghostpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });
});