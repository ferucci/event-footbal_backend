import { IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';

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
  @IsNotEmpty()
  rate?: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  country?: string; // URL to flag image

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  site: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image?: string; // URL to player image

  @IsNumber()
  countClicks?: number = 0;
}