import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoles } from '../enums/user-roles.enum';

export class ListUsersDto {
  @ApiProperty()
  @Expose()
  login: string;

  @ApiProperty()
  @Expose()
  roles: UserRoles[];
}
