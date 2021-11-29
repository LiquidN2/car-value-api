import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // DI does not play well with typescript generics (ie Repository<User>)
  // @InjectRepository decorator will help DI in this case
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // Create an User entity instance
    const user = this.repo.create({ email, password });

    // If save an entity instance, all the hooks (@AfterInsert, @AfterUpdate, ...)
    // tied to that instance will be executed.
    // If save data directly, no hooks will be executed
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.repo.remove(user);
  }
}
