const request = require('supertest');
const app = require('../server');
const Comment = require('../../models/Comment');

describe('Comment API CRUD', () => {
  it('should create a comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ comment: 'This is a test comment' });

    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toBe('This is a test comment');
  });

  it('should return all comments', async () => {
    await Comment.create({ comment: 'Another comment' });

    const res = await request(app).get('/api/comments');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a comment by ID', async () => {
    const created = await Comment.create({ comment: 'Target comment' });

    const res = await request(app).get(`/api/comments/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBe('Target comment');
  });

  it('should update a comment', async () => {
    const created = await Comment.create({ comment: 'Old content' });

    const res = await request(app)
      .put(`/api/comments/${created._id}`)
      .send({ comment: 'Updated content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBe('Updated content');
  });

  it('should delete a comment', async () => {
    const created = await Comment.create({ comment: 'Delete me' });

    const res = await request(app).delete(`/api/comments/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Comment deleted');
  });
});