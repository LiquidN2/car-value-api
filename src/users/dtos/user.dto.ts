import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() // this decorator decides which property is exposed
  id: number;

  @Expose()
  email: string;
}
