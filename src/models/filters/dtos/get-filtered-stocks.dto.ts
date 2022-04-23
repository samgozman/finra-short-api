import { Type, Transform } from 'class-transformer';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
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
import { SortDirection } from '../enums/SortDirection';
import { IFiltersList } from '../schemas/filter.schema';
import { Filters } from '../filter-unit.service';
import { IStock, SortDirs, StockKeys } from '../../stocks/schemas/stock.schema';
import { ApiProperty } from '@nestjs/swagger';

// Duplication required for validation to work,
// since an interface cannot be turned into an array in a TS,
// and an Enum cannot be protected from missing keys
const filtersObject: IFiltersList = {
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
	abnormalShortlVolGrows: false,
	abnormalShortVolDecreases: false,
	abnormalTotalVolGrows: false,
	abnormalTotalVolDecreases: false,
	abnormalShortExemptVolGrows: false,
	abnormalShortExemptVolDecreases: false,
};

const sortObject: Partial<IStock> = {
	ticker: '',
	shortVolRatioLast: 0,
	shortExemptVolRatioLast: 0,
	totalVolLast: 0,
	shortVolRatio5DAVG: 0,
	shortExemptVolRatio5DAVG: 0,
	totalVol5DAVG: 0,
	shortVolRatio20DAVG: 0,
	shortExemptVolRatio20DAVG: 0,
	totalVol20DAVG: 0,
};

// Filters can be of type IFiltersList or empty
const filtersArray = [...Object.keys(filtersObject), ''];
const sortKeysObject = [...Object.keys(sortObject)];

export class GetFilteredStocksDto {
	@ApiProperty({ required: false, description: 'Limit stocks per response' })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit: number = 25;

	@ApiProperty({
		required: false,
		description: 'The number of stocks to skip from the start (pagination)',
	})
	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(100000)
	@Type(() => Number)
	skip: number = 0;

	@ApiProperty({ required: false, description: 'Sort by key of Stock object' })
	@IsOptional()
	@IsIn(sortKeysObject)
	sortby: StockKeys = 'ticker';

	@ApiProperty({
		required: false,
		description: 'Sort direction (`asc` or `desc`)',
	})
	@IsOptional()
	@IsEnum(SortDirection, {
		message: `sort direction can be 'asc' or 'desc' only`,
	})
	sortdir: SortDirs = 'asc';

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
	filters?: Filters[];

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
