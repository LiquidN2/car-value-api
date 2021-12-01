import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // await rm(join(__dirname, '..', 'test.sqlite'));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('should handle signup request', () => {
    const mockEmail = 'asdca@test.com';
    const mockPassword = 'asdvasdv';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockEmail, password: mockPassword })
      .expect(201)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(mockEmail);
      });
  });

  it('should signup a new user and get the currently signed in user', async () => {
    const mockEmail = 'asdca@test.com';
    const mockPassword = 'asdvasdv';

    // Sign Up
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockEmail, password: mockPassword })
      .expect(201);

    // Get cookie from response
    const cookie = response.get('Set-Cookie');

    // Get body response from 'auth/whoami'
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(mockEmail);
  });
});
