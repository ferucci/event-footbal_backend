import { IsNumber } from 'class-validator';

export class SelectedPlayerDto {
  @IsNumber()
  id: number;
}