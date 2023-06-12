import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserPrivileges } from '../schemas/user.schema';

export class UserDto {
  @ApiProperty()
  @Expose()
  login: string;

  @ApiProperty()
  @Expose()
  roles: UserPrivileges[];
}
