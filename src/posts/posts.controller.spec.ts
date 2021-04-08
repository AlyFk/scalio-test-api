import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

describe('Post Controller', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      // If you've looked at the complex sample you'll notice that these functions
      // are a little bit more in depth using mock implementation
      // to give us a little bit more control and flexibility in our tests
      // this is not necessary, but can sometimes be helpful in a test scenario
      providers: [
        {
          provide: PostsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                userId: 1,
                title:
                  'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                body:
                  'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
              },
              {
                userId: 1,
                title: 'qui est esse',
                body:
                  'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
              },
              {
                userId: 1,
                title:
                  'ea molestias quasi exercitationem repellat qui ipsa sit aut',
                body:
                  'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                userId: 1,
                id,
                title:
                  'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                body:
                  'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((post: CreatePostDto) =>
                Promise.resolve({ id: 1, ...post }),
              ),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of posts', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        {
          userId: 1,
          title:
            'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
          body:
            'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        },
        {
          userId: 1,
          title: 'qui est esse',
          body:
            'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
        },
        {
          userId: 1,
          title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
          body:
            'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
        },
      ]);
    });
  });
  describe('findOne', () => {
    it('should get a single post', async () => {
      await expect(controller.findOne(1)).resolves.toEqual({
        userId: 1,
        id: 1,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      });
      await expect(controller.findOne(3)).resolves.toEqual({
        userId: 1,
        id: 3,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      });
    });
  });
  describe('create', () => {
    it('should create a new post', async () => {
      const newPostDTO: CreatePostDto = {
        userId: 1,
        title: 'dolorem dolore est ipsam',
        body:
          'dignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae',
      };
      await expect(controller.create(newPostDTO)).resolves.toEqual({
        id: 1,
        ...newPostDTO,
      });
    });
  });
  describe('delete post', () => {
    it('should return that it deleted a cat', async () => {
      await expect(controller.delete(1)).resolves.toEqual(
        {
          deleted: true,
        },
      );
    });
    it('should return that it did not delete a cat', async () => {
      const deleteSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValueOnce({ deleted: false });
      await expect(
        controller.delete(100),
      ).resolves.toEqual({ deleted: false });
      expect(deleteSpy).toBeCalledWith(100);
    });
  });
});
