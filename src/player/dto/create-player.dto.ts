import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  number?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  height?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  weight?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  position?: string;

  @IsNumber()
  @IsOptional()
  rate?: number | null;

  @IsString()
  @IsNotEmpty()
  country?: string; // URL to flag image

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  site: string;

  @IsString()
  @IsNotEmpty()
  image?: string; // URL to player image

  @IsNumber()
  countClicks?: number = 0;
}