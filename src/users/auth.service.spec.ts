import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService = null;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // Create a mock UsersService
    mockUsersService = {
      // find and create are used by AuthService
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      create: (email: string, password: string) => {
        const newUser = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;

        users.push(newUser);

        return Promise.resolve(newUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // Replace the instance of UserService by a mock obj
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  // SIGN UP
  it('should create a new user with salted password', async () => {
    const mockedEmail = 'test@test.com';
    const mockedPassword = 'test1234';

    const user = await service.signup(mockedEmail, mockedPassword);
    // Verify the stored password is not the same as the entered password
    expect(user.password).not.toEqual(mockedEmail);

    // Verify the stored password contains the salt and the hash
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if signup email is in use', async () => {
    await service.signup('test@test.com', 'test1234');

    try {
      await service.signup('test@test.com', 'test1234');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  // SIGN IN
  it('should throw an error if signin password is incorrect', async () => {
    await service.signup('test@test.com', 'test1234');

    try {
      await service.signin('test@test.com', 'test1233');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should return a user if login username and password are correct', async () => {
    await service.signup('test@test.com', 'test1234');
    const user = await service.signin('test@test.com', 'test1234');
    expect(user).toBeDefined();
  });
});
