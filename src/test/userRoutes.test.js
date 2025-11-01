import request from 'supertest';
import app from '../app.js';

describe('GET /api/user/', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/api/user/');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
