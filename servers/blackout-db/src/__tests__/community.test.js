const request = require('supertest');
const { app }  = require('../server');
const CommunityInteraction = require('../../models/CommunityInteraction');
const Comment = require('../../models/Comment');

describe('CommunityInteraction API CRUD', () => {
  it('should create an interaction', async () => {
    const res = await request(app)
      .post('/api/community')
      .send({ documentId: '507f1f77bcf86cd799439011', likes: ['507f1f77bcf86cd799439099'] });

    expect(res.statusCode).toBe(201);
    expect(res.body.likes).toContain('507f1f77bcf86cd799439099');
  });

  it('should return all interactions', async () => {
    await CommunityInteraction.create({ documentId: '507f1f77bcf86cd799439012', likes: ['507f1f77bcf86cd799439098'] });

    const res = await request(app).get('/api/community');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return an interaction by ID', async () => {
    const created = await CommunityInteraction.create({ documentId: '507f1f77bcf86cd799439013', likes: ['507f1f77bcf86cd799439097'] });

    const res = await request(app).get(`/api/community/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain('507f1f77bcf86cd799439097');
  });

  it('should update an interaction', async () => {
    const created = await CommunityInteraction.create({ documentId: '507f1f77bcf86cd799439014', likes: [] });

    const res = await request(app)
      .put(`/api/community/${created._id}`)
      .send({ likes: ['507f1f77bcf86cd799439096'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain('507f1f77bcf86cd799439096');
  });

  it('should delete an interaction', async () => {
    const created = await CommunityInteraction.create({ documentId: '507f1f77bcf86cd799439015', likes: ['507f1f77bcf86cd799439095'] });

    const res = await request(app).delete(`/api/community/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Interaction deleted');
  });

  it('should create a community interaction with a comment and return it populated', async () => {
    // Step 1: Create a comment
    const comment = await Comment.create({
      comment: 'This is a linked comment.'
    });

    // Step 2: Link comment in interaction
    const community = await CommunityInteraction.create({
      documentId: '507f1f77bcf86cd799439016',
      likes: ['507f1f77bcf86cd799439094'],
      comments: [comment._id]
    });

    // Step 3: Fetch and expect the populated comment
    const res = await request(app).get(`/api/community/${community._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain('507f1f77bcf86cd799439094');
    expect(res.body.comments).toBeDefined();
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].comment).toBe('This is a linked comment.');
  });
});