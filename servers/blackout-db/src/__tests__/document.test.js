const request = require('supertest');
const { app }  = require('../server');
const BlackoutDocument = require('../../models/BlackoutDocument');

describe('BlackoutDocument API CRUD', () => {
  it('should create a document', async () => {
    const res = await request(app)
      .post('/api/documents')
      .send({
        documentName: 'Test Doc',
        content: 'Original Content',
        blackoutWords: [],
        collaborators: [],
        state: 'private'
      })

    expect(res.statusCode).toBe(201);
    expect(res.body.documentName).toBe('Test Doc');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
  });

  it('should return all documents', async () => {
    await BlackoutDocument.create({ documentName: 'Doc A', content: '...', state: 'review' });

    const res = await request(app).get('/api/documents');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a document by ID', async () => {
    const created = await BlackoutDocument.create({ documentName: 'Doc B', content: '...', state: 'final' });

    const res = await request(app).get(`/api/documents/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.documentName).toBe('Doc B');
  });

  it('should update a document', async () => {
    const created = await BlackoutDocument.create({ documentName: 'ToUpdate', content: '...', state: 'initial' });

    const res = await request(app)
      .put(`/api/documents/${created._id}`)
      .send({ state: 'public' });

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('public');
  });

  it('should delete a document', async () => {
    const created = await BlackoutDocument.create({ documentName: 'ToDelete', content: '...', state: 'dead' });

    const res = await request(app).delete(`/api/documents/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Document deleted');
  });

  it('should add a blackout word to a document', async () => {
    const doc = await BlackoutDocument.create({
      documentName: 'WithWords',
      content: 'This is a test document',
      state: 'private'
    });

    const res = await request(app)
      .post(`/api/documents/${doc._id}/blackout`)
      .send({
        index: 2,
        length: 1,
        createdBy: null
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.blackoutWords.length).toBe(1);
    expect(res.body.blackoutWords[0].index).toBe(2);
    expect(res.body.blackoutWords[0]).toHaveProperty('timestamp');
  });

  it('should remove a blackout word from a document', async () => {
    const doc = await BlackoutDocument.create({
      documentName: 'RemoveTestDoc',
      content: 'Another test sentence for blackout.',
      blackoutWords: [
        { index: 5, length: 1, createdBy: null }
      ],
      state: 'private'
    });

    const res = await request(app)
      .delete(`/api/documents/${doc._id}/blackout`)
      .send({ index: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.blackoutWords.length).toBe(0);
  });

  it('should return a random public document', async () => {
    await BlackoutDocument.create([
      { documentName: 'PublicDoc1', content: '...', state: 'public' },
      { documentName: 'PublicDoc2', content: '...', state: 'public' }
    ]);

    const res = await request(app).get('/api/documents/random');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('documentName');
    expect(res.body.state).toBe('public');
  });
});