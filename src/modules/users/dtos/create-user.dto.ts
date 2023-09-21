import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
  IsString,
  IsArray,
} from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRoles, { each: true })
  @IsArray()
  roles?: (keyof typeof UserRoles)[];
}
