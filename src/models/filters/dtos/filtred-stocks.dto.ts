import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '../../../models/stocks/schemas/stock.schema';

export class FiltredStocksDto {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: () => [Stock] })
	stocks: Stock[];
}
