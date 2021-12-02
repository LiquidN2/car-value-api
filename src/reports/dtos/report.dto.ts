import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
  @Expose() // this decorator decides which property is exposed
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  // Sale location
  @Expose()
  lng: number;

  // Sale location
  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
