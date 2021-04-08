import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

const newPosts = ({
  body,
  title,
  userId,
}: {
  body: string;
  title: string;
  userId: number;
}) => {
  const post = new Post();
  post.body = body;
  post.userId = userId;
  post.title = title;
};

const allPosts = [
  newPosts({
    userId: 1,
    title: 'eum et est occaecati',
    body:
      'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit',
  }),
  newPosts({
    userId: 1,
    title: 'nesciunt quas odio',
    body:
      'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
  }),
  newPosts({
    userId: 1,
    title: 'nesciunt quas odio',
    body:
      'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
  }),
];

const onePost = newPosts({
  userId: 1,
  title: 'nesciunt quas odio',
  body:
    'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
});

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: jest.fn().mockResolvedValue(allPosts),
            findOneOrFail: jest.fn().mockResolvedValue(onePost),
            create: jest.fn().mockReturnValue(onePost),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = await service.findAll();
      expect(posts).toEqual(allPosts);
    });
  });

  describe('findOne', () => {
    it('should get a single post', () => {
      const repoSpy = jest.spyOn(repo, 'findOneOrFail');
      expect(service.findOne(1)).resolves.toEqual(onePost);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should successfully insert a post', () => {
      expect(
        service.create({
          userId: 1,
          title: 'nesciunt quas odio',
          body:
            'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
        }),
      ).resolves.toEqual(onePost);
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        userId: 1,
        title: 'nesciunt quas odio',
        body:
          'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
      });
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('deleteOne', () => {
    it('should return {deleted: true}', () => {
      expect(service.delete(1)).resolves.toEqual({ deleted: true });
    });
    it('should return {deleted: false, message: err.message}', () => {
      const repoSpy = jest
        .spyOn(repo, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(service.delete(100)).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
      expect(repoSpy).toBeCalledWith({ id: 100 });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
