import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserApiKeyDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  login: string;
}
