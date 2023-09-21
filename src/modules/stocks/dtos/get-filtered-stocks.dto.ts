import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { SortDirection } from '../enums/sort-direction.enum';
import {
  StockFilters,
  StockObject,
  filtersArray,
  sortKeysObject,
} from '../stock.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetFilteredStocksDto {
  @ApiProperty({ required: false, description: 'Limit stocks per response' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit = 25;

  @ApiProperty({
    required: false,
    description: 'The number of stocks to skip from the start (pagination)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  @Type(() => Number)
  skip = 0;

  @ApiProperty({ required: false, description: 'Sort by key of Stock object' })
  @IsOptional()
  @IsIn(sortKeysObject)
  sortby: keyof StockObject = 'ticker';

  @ApiProperty({
    required: false,
    description: 'Sort direction (`asc` or `desc`)',
  })
  @IsOptional()
  @IsIn([SortDirection.ASC, SortDirection.DESC], {
    message: `sort direction can be 'ASC' or 'DESC' only`,
  })
  sortDir: keyof typeof SortDirection = 'ASC';

  @ApiProperty({
    isArray: true,
    required: false,
    description: 'Array of filters',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  @IsIn(filtersArray, { each: true })
  filters?: (keyof StockFilters)[];

  @ApiProperty({
    isArray: true,
    required: false,
    description: `A string with tickers separated by a comma.
		 Restrict the initial search array to only the specified stocks. 
		Useful for tracking restricted stocks.`,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.toUpperCase().split(','))
  @IsNotEmpty({ each: true })
  @MaxLength(16, { each: true })
  @ArrayMaxSize(25)
  @Matches(/^([a-zA-Z0-9]\.?)+$/s, {
    message:
      'the ticker string can only contain a set of alphanumeric values and a period, separated by a comma.',
    each: true,
  })
  tickers?: string[];
}
