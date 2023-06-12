import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ApiKeyDto {
  @ApiProperty()
  @Expose()
  login: string;

  @ApiProperty()
  @Expose()
  apikey: string;
}
