import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetStockDto } from './dtos/get-stock.dto';
import { StocksService } from './stocks.service';

@Controller('stock')
export class StocksController {
	constructor(private stocksService: StocksService) {}

	@Get()
	@Roles('stockInfo')
	@UseGuards(RolesGuard)
	getStock(@Query() query: GetStockDto) {
		return query;
	}
}
