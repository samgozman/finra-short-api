import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @ApiProperty()
  @Expose()
  login: string;
}
