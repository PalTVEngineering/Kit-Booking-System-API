import request from 'supertest';
import app from '../app.js';

describe('GET /api/kit/', () => {
  it('should return a list of kits', async () => {
    const response = await request(app).get('/api/kit/');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
