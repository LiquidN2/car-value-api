import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUsersDto) {
    return await this.authService.signup(body.email, body.password);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUsersDto) {
    return await this.usersService.update(parseInt(id), body);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);
    if (users.length === 0) {
      throw new NotFoundException('User(s) not found');
    }
    return users;
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Post('/signin')
  async authenticateUser(@Body() body: CreateUsersDto) {
    return await this.authService.signin(body.email, body.password);
  }
}
