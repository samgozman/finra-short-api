import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class GetLinkDto {
  @ApiProperty()
  @IsUrl()
  link: string;
}
