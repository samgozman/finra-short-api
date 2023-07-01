import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class UpdateRolesDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  login: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(UserRoles)
  role: UserRoles;
}
