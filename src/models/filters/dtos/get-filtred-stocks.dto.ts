import { Type, Transform } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';
import { SortDirection } from '../enums/SortDirection';
import { IFiltersList } from '../schemas/filter.schema';
import { Filters } from '../filter-unit.service';

// Duplication required for validation to work,
// since an interface cannot be turned into an array in a TS,
// and an Enum cannot be protected from missing keys
const filtersObject: IFiltersList = {
	onTinkoff: false,
	isNotGarbage: false,
	shortVolGrows5D: false,
	shortVolDecreases5D: false,
	shortVolRatioGrows5D: false,
	shortVoRatiolDecreases5D: false,
	totalVolGrows5D: false,
	totalVolDecreases5D: false,
	shortExemptVolGrows5D: false,
	shortExemptVolDecreases5D: false,
	shortExemptVolRatioGrows5D: false,
	shortExemptVolRatioDecreases5D: false,
	shortVolGrows3D: false,
	shortVolDecreases3D: false,
	shortVolRatioGrows3D: false,
	shortVoRatiolDecreases3D: false,
	totalVolGrows3D: false,
	totalVolDecreases3D: false,
	shortExemptVolGrows3D: false,
	shortExemptVolDecreases3D: false,
	shortExemptVolRatioGrows3D: false,
	shortExemptVolRatioDecreases3D: false,
};

// Filters can be of type IFiltersList or empty
const filtersArray = [...Object.keys(filtersObject), ''];

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

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@Transform(({ value }) => value.split(','))
	@IsIn(filtersArray, { each: true })
	filters: Filters[];
}
