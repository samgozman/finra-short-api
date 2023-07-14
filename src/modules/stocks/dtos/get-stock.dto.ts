import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsNotEmpty,
  Matches,
  MaxLength,
  IsIn,
} from 'class-validator';
import { SortDirection } from '../enums/sort-direction.enum';

export class GetStockDto {
  @ApiProperty({ description: 'Stock ticker' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @Matches(/^([a-zA-Z0-9]\.?)+$/s, {
    message: 'ticker can only contain letters, numbers and a period.',
  })
  @Transform(({ value }) => value.toUpperCase())
  ticker: string;

  @ApiProperty({ required: false, description: 'Max volume elements' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  limit = 10000;

  @ApiProperty({
    required: false,
    description: 'Sort stock volume by date (`ASC` or `DESC` direction)',
  })
  @IsOptional()
  @IsIn([SortDirection.ASC, SortDirection.DESC], {
    message: `sort direction can be 'ASC' or 'DESC' only`,
  })
  sort: keyof typeof SortDirection = 'ASC';
}
