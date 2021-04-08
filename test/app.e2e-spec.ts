import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('CatModule', () => {
    // small script to remove all database entries for cat between tests
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/posts');
      await Promise.all(
        uncleared.body.map(async post => {
          return request(app.getHttpServer()).delete(`/posts/${post.id}`);
        }),
      );
    });

    it('Post cat, get all, get by id, delete', async () => {
      const newPost = {
        userId: 1,
        title: 'optio molestias id quia eum',
        body:
          'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error',
      };
      const data = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .expect(201);
      expect(data.body).toEqual({
        ...newPost,
        id: expect.any(Number),
      });
      const posts = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);
      expect(posts.body).toEqual(expect.any(Array));
      expect(posts.body.length).toBe(1);
      expect(posts.body[0]).toEqual({
        ...newPost,
        id: expect.any(Number),
      });
      const getPost = await request(app.getHttpServer())
        .get(`/posts/${data.body.id}`)
        .expect(200);
      expect(getPost.body).toEqual(data.body);
      return request(app.getHttpServer())
        .delete(`/posts/${data.body.id}`)
        .expect(200)
        .expect({ deleted: true });
    });
  });
});
