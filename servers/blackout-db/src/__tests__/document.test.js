const request = require('supertest');
const app = require('../server');
const BlackoutDocument = require('../../models/BlackoutDocument');

describe('BlackoutDocument API CRUD', () => {
  it('should create a document', async () => {
    const res = await request(app)
      .post('/api/documents')
      .send({
        documentName: 'Test Doc',
        content: 'Original Content',
        blackoutContent: 'Hidden Content',
        state: 'draft'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.documentName).toBe('Test Doc');
  });

  it('should return all documents', async () => {
    await BlackoutDocument.create({ documentName: 'Doc A', content: '...', blackoutContent: '...', state: 'review' });

    const res = await request(app).get('/api/documents');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a document by ID', async () => {
    const created = await BlackoutDocument.create({ documentName: 'Doc B', content: '...', blackoutContent: '...', state: 'final' });

    const res = await request(app).get(`/api/documents/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.documentName).toBe('Doc B');
  });

  it('should update a document', async () => {
    const created = await BlackoutDocument.create({ documentName: 'ToUpdate', content: '...', blackoutContent: '...', state: 'initial' });

    const res = await request(app)
      .put(`/api/documents/${created._id}`)
      .send({ state: 'edited' });

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('edited');
  });

  it('should delete a document', async () => {
    const created = await BlackoutDocument.create({ documentName: 'ToDelete', content: '...', blackoutContent: '...', state: 'dead' });

    const res = await request(app).delete(`/api/documents/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Document deleted');
  });
});