const request = require('supertest');
const app = require('../src/app');
const { pool, initDb } = require('../src/db');

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await pool.query('TRUNCATE todos RESTART IDENTITY');
});

afterAll(async () => {
  await pool.end();
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Todos API', () => {
  it('GET /api/todos returns empty array initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'write tests' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('write tests');
    expect(res.body.completed).toBe(false);
  });

  it('POST /api/todos without title returns 400', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.status).toBe(400);
  });

  it('PATCH /api/todos/:id toggles completion', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ title: 'toggle me' });
    const res = await request(app).patch(`/api/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /api/todos/:id removes it', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ title: 'delete me' });
    const res = await request(app).delete(`/api/todos/${created.body.id}`);
    expect(res.status).toBe(204);

    const list = await request(app).get('/api/todos');
    expect(list.body).toEqual([]);
  });
});
