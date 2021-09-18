import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
	IsNotEmpty,
	Matches,
	MaxLength,
} from 'class-validator';
import { SortDirection } from '../../filters/enums/SortDirection';
import { SortDirs } from '../schemas/stock.schema';

export class GetStockDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@Matches(/^([a-zA-Z0-9]\.?)+$/s, {
		message: 'ticker can only contain letters, numbers and a period.',
	})
	@Transform(({ value }) => value.toUpperCase())
	ticker: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10000)
	@Type(() => Number)
	limit: number = 10000;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(SortDirection, {
		message: `sort direction can be 'asc' or 'desc' only`,
	})
	sort: SortDirs = 'asc';
}
