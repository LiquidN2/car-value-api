import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  // Sale location
  @IsLongitude()
  lng: number;

  // Sale location
  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
