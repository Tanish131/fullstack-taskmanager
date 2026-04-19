const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

beforeEach(() => User._clear());
afterAll(() => User._clear());

const user = { name: 'Test User', email: 'test@example.com', password: 'password123' };

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).not.toHaveProperty('password');
    });
    it('rejects duplicate email', async () => {
      await request(app).post('/api/auth/register').send(user);
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.statusCode).toBe(409);
    });
    it('rejects invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({ ...user, email: 'bad' });
      expect(res.statusCode).toBe(400);
    });
    it('rejects short password', async () => {
      const res = await request(app).post('/api/auth/register').send({ ...user, password: '123' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => { await request(app).post('/api/auth/register').send(user); });
    it('logs in with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
    it('rejects wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('returns profile with valid token', async () => {
      const reg = await request(app).post('/api/auth/register').send(user);
      const res = await request(app).get('/api/auth/profile').set('Authorization', `Bearer ${reg.body.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe(user.email);
    });
    it('rejects missing token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
    });
  });
});
