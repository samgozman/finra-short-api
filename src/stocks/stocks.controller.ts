import { Controller, Get, Query } from '@nestjs/common';
import { GetStockDto } from './dtos/get-stock.dto';
import { StocksService } from './stocks.service';

@Controller('stock')
export class StocksController {
	constructor(private stocksService: StocksService) {}

	@Get()
	getStock(@Query() query: GetStockDto) {
		return query;
	}
}
