import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserApiKeyDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  login: string;
}
