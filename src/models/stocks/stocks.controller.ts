import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetStockDto } from './dtos/get-stock.dto';
import { StockDto } from './dtos/stock.dto';
import { StocksService } from './stocks.service';

@ApiTags('stock')
@Controller('stock')
export class StocksController {
	constructor(private stocksService: StocksService) {}

	@Get()
	@SkipThrottle()
	@Roles('stockInfo')
	@UseGuards(RolesGuard)
	@Serialize(StockDto)
	@ApiSecurity('user-api-token')
	@ApiOkResponse({ description: 'Stock response object', type: StockDto })
	getStock(@Query() query: GetStockDto) {
		return this.stocksService.get(query);
	}
}
