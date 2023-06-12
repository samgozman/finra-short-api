import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString, MinLength } from 'class-validator';
import { UserPrivileges, UserRules } from '../schemas/user.schema';

export class UpdateRolesDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  login: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(UserRules)
  role: UserPrivileges;
}
