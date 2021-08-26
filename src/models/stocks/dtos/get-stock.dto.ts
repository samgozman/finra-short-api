import { Type } from 'class-transformer';
import {
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
	IsNotEmpty,
} from 'class-validator';
import { SortDirection } from '../../filters/enums/SortDirection';
import { SortDirs } from '../schemas/stock.schema';

export class GetStockDto {
	@IsString()
	@IsNotEmpty()
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
