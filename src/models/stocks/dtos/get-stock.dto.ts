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
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@Matches(/^([a-zA-Z0-9]\.?)+$/s, {
		message: 'ticker can only contain letters, numbers and a period.',
	})
	@Transform(({ value }) => value.toUpperCase())
	ticker: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit: number = 21;

	@IsOptional()
	@IsEnum(SortDirection, {
		message: `sort direction can be 'asc' or 'desc' only`,
	})
	sort: SortDirs = 'asc';
}
