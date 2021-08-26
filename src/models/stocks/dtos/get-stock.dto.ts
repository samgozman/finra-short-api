import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortDirection } from '../../filters/enums/SortDirection';
import { SortDirs } from '../schemas/stock.schema';

export class GetStockDto {
	@IsString()
	ticker: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit?: number;

	@IsOptional()
	@IsEnum(SortDirection, {
		message: `sort direction can be 'asc' or 'desc' only`,
	})
	sort?: SortDirs;
}
