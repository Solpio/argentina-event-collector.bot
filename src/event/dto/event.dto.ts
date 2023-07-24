import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class EventDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  link: string;

  @IsString()
  description: string;

  @IsString()
  date: string;

  @IsBoolean()
  isApproved: boolean;

  @IsString()
  time: string;
}
