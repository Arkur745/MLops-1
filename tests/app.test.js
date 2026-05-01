import app from '../src/app.js';
import request from 'supertest';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
  describe('GET /api', () => {
    it('should return API is running', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'API is running');
    });
  });
  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
