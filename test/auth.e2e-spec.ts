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
});
