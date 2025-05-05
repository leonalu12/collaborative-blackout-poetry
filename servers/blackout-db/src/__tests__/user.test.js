const request = require('supertest');
const { app }  = require('../server');
const User = require('../../models/User');

describe('User API CRUD', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Create user
  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Luis', email: 'luis@example.com', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Luis');
    expect(res.body.email).toBe('luis@example.com');
  });

  // Get all users
  it('should return all users', async () => {
    await User.create({ name: 'Ana', email: 'ana@example.com', password: '123456' });

    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Get a single user by ID
  it('should return a user by ID', async () => {
    const created = await User.create({ name: 'Carlos', email: 'carlos@example.com', password: '123456' });

    const res = await request(app).get(`/api/users/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Carlos');
  });

  // Update user
  it('should update a user', async () => {
    const created = await User.create({ name: 'Test User', email: 'test@example.com', password: '123456' });

    const res = await request(app)
      .put(`/api/users/${created._id}`)
      .send({ name: 'Updated User' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });

  // Delete user
  it('should delete a user', async () => {
    const created = await User.create({ name: 'Delete Me', email: 'delete@example.com', password: '123456' });

    const res = await request(app).delete(`/api/users/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });
});