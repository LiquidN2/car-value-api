import { IsString, IsEmail } from 'class-validator';

export class CreateUsersDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
