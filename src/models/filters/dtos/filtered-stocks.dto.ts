import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '../../stocks/schemas/stock.schema';

export class FilteredStocksDto {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: () => [Stock] })
	stocks: Stock[];
}
