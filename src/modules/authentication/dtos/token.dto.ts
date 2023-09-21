import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenDto {
  @ApiProperty()
  @Expose()
  accessToken: string;
}
