import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetStockDto } from './dtos/get-stock.dto';
import { StockDto } from './dtos/stock.dto';
import { GetFilteredStocksDto } from './dtos/get-filtered-stocks.dto';
import { FilteredStocksDto } from './dtos/filtered-stocks.dto';
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
  @ApiOperation({ summary: 'Find one stock object (with volumes) by ticker' })
  @ApiOkResponse({ description: 'Stock response object', type: StockDto })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  getStock(@Query() query: GetStockDto) {
    return this.stocksService.get(query);
  }

  @Get('/screener')
  @Roles('screener')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get filtered stocks by query' })
  @ApiOkResponse({
    description: 'Filters response object',
    type: FilteredStocksDto,
  })
  @ApiForbiddenResponse()
  @ApiSecurity('user-api-token')
  getFilter(@Query() query: GetFilteredStocksDto) {
    return this.stocksService.getFilteredStocks(query);
  }
}
