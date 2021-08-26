import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { GetStockDto } from './dtos/get-stock.dto';
import { StockDto } from './dtos/stock.dto';
import { StocksService } from './stocks.service';

@Controller('stock')
export class StocksController {
	constructor(private stocksService: StocksService) {}

	@Get()
	@Roles('stockInfo')
	@UseGuards(RolesGuard)
	@Serialize(StockDto)
	getStock(@Query() query: GetStockDto) {
		return this.stocksService.get(query);
	}
}
