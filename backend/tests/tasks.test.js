const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

let token;

beforeEach(async () => {
  User._clear(); Task._clear();
  const res = await request(app).post('/api/auth/register').send({ name: 'Tester', email: 'tester@example.com', password: 'password123' });
  token = res.body.token;
});
afterAll(() => { User._clear(); Task._clear(); });

const task = { title: 'Build Jenkins Pipeline', priority: 'high', status: 'pending' };

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('creates a task', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(task);
      expect(res.statusCode).toBe(201);
      expect(res.body.task).toHaveProperty('id');
      expect(res.body.task.title).toBe(task.title);
    });
    it('rejects missing title', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ priority: 'high' });
      expect(res.statusCode).toBe(400);
    });
    it('requires auth', async () => {
      const res = await request(app).post('/api/tasks').send(task);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(task);
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Write tests', status: 'completed', priority: 'low' });
    });
    it('returns all user tasks', async () => {
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.tasks).toHaveLength(2);
    });
    it('filters by status', async () => {
      const res = await request(app).get('/api/tasks?status=completed').set('Authorization', `Bearer ${token}`);
      expect(res.body.tasks.every(t => t.status === 'completed')).toBe(true);
    });
    it('searches by title', async () => {
      const res = await request(app).get('/api/tasks?search=Jenkins').set('Authorization', `Bearer ${token}`);
      expect(res.body.tasks).toHaveLength(1);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('updates a task', async () => {
      const create = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(task);
      const res = await request(app).put(`/api/tasks/${create.body.task.id}`).set('Authorization', `Bearer ${token}`).send({ status: 'completed' });
      expect(res.statusCode).toBe(200);
      expect(res.body.task.status).toBe('completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task', async () => {
      const create = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(task);
      const del = await request(app).delete(`/api/tasks/${create.body.task.id}`).set('Authorization', `Bearer ${token}`);
      expect(del.statusCode).toBe(200);
    });
  });

  describe('GET /api/tasks/stats', () => {
    it('returns stats', async () => {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(task);
      const res = await request(app).get('/api/tasks/stats').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.stats.total).toBe(1);
    });
  });
});
