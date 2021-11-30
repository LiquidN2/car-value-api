import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';

const script = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if user email exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash/encrypt password
    // Generate the salt
    const salt = randomBytes(8).toString('hex');

    // Hash the joined password and salt
    const hash = (await script(password, salt, 32)) as Buffer;

    // Join the hashed and the salt
    const result = salt + '.' + hash.toString('hex');

    // Create the new user with hashed+salt as password and return the user
    return await this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    // Check if user exists
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid email and/or password');
    }

    // Get the salt from stored
    const { password: storedPassword } = user;
    const [salt, storedHash] = storedPassword.split('.');

    // Join the salt with entered password
    const enteredHash = (await script(password, salt, 32)) as Buffer;

    // Compare the result with stored password
    if (storedHash !== enteredHash.toString('hex')) {
      throw new BadRequestException('Invalid email and/or password');
    }

    // Authenticate user
    return user;
  }
}
