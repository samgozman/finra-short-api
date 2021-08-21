import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortDirection } from '../enums/SortDirection';

export class GetFiltredStocksDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(100000)
	@Type(() => Number)
	skip: number;

	@IsOptional()
	@IsEnum(SortDirection, {
		message: `sort direction can be 'asc' or 'desc' only`,
	})
	sort: SortDirection;

	// ! String must be of Type Filters (comma separated)
	@IsOptional()
	@IsString()
	filters: string;
}
