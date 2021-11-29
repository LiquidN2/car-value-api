import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { UsersService } from './users.service';

@Controller('/auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUsersDto) {
    try {
      return await this.userService.create(body.email, body.password);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUsersDto) {
    return await this.userService.update(parseInt(id), body);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.userService.find(email);
    if (users.length === 0) {
      throw new NotFoundException('User(s) not found');
    }
    return users;
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
