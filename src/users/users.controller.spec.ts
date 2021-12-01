import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import mock = jest.mock;

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    let users: User[] = [];

    mockUsersService = {
      find(email: string) {
        // const filteredUsers = users.filter(user => user.email === email);
        // return Promise.resolve(filteredUsers);
        return Promise.resolve([
          { id: 1, email, password: 'test1234' } as User,
        ]);
      },

      findOne(id: number) {
        // const user = users.find(user => user.id === id);
        // return Promise.resolve(user);
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test1234',
        } as User);
      },

      remove(id: number) {
        const user = users.find(user => user.id === id);
        users = users.filter(user => user.id !== id);
        return Promise.resolve(user);
      },

      update(id: number, attrs: Partial<User>) {
        const user = users.find(user => user.id === id);
        Object.assign(user, attrs);
        return Promise.resolve(user);
      },
    };

    mockAuthService = {
      signup(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User);
      },

      signin(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // findUser
  it('findUser should return user with id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toBe(1);
  });

  it('findUser should throw error if id not found', async () => {
    mockUsersService.findOne = (id: number) => Promise.resolve(null);

    try {
      await controller.findUser('2');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  // findAllUsers
  it('findAllUsers should return list of users based on provided email', async () => {
    const [user] = await controller.findAllUsers('test@test.com');
    expect(user.email).toBe('test@test.com');
  });

  it('findAllUsers should throw error if email not found', async () => {
    mockUsersService.find = (email: string) => Promise.resolve([]);

    try {
      await controller.findAllUsers('notfound@test.com');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  // signinUser
  it('signinUser should return user and create session with user id', async () => {
    const mockSession = { userId: null };
    const mockBody = { email: 'test@test.com', password: 'test1234' };

    const user = await controller.signinUser(mockBody, mockSession);

    expect(user.email).toBe(mockBody.email);
    expect(mockSession.userId).toBe(user.id);
  });
});
