import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API flows (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signs up and logs in a user', async () => {
    const email = `user+${Date.now()}@example.com`;
    const password = 'password123';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 'E2E User', email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it('creates and lists categories', async () => {
    const server = app.getHttpServer();

    const createRes = await request(server)
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Work' })
      .expect(201);

    expect(createRes.body.id).toBeDefined();

    const listRes = await request(server)
      .get('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);
  });

  it('creates a todo and fetches it', async () => {
    const server = app.getHttpServer();

    const categoryRes = await request(server)
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Personal' })
      .expect(201);

    const categoryId = categoryRes.body.id as string;

    const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

    const todoRes = await request(server)
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ categoryId, title: 'Buy milk', dueDate })
      .expect(201);

    const todoId = todoRes.body.id as string;

    const getRes = await request(server)
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(getRes.body.id).toBe(todoId);
  });

  it('completes a todo', async () => {
    const server = app.getHttpServer();

    const categoryRes = await request(server)
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Chores' })
      .expect(201);

    const categoryId = categoryRes.body.id as string;

    const todoRes = await request(server)
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ categoryId, title: 'Clean house' })
      .expect(201);

    const todoId = todoRes.body.id as string;

    const completeRes = await request(server)
      .post(`/todos/${todoId}/complete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(completeRes.body.status).toBeDefined();
  });

  it('creates, lists, and marks notifications as read', async () => {
    const server = app.getHttpServer();

    const createRes = await request(server)
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Hello', message: 'World' })
      .expect(201);

    const notificationId = createRes.body.id as string;

    const listRes = await request(server)
      .get('/notifications/unread')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.some((n: any) => n.id === notificationId)).toBe(true);

    await request(server)
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const listAfter = await request(server)
      .get('/notifications/unread')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(listAfter.body.some((n: any) => n.id === notificationId)).toBe(false);
  });
});
