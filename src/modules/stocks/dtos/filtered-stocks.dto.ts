import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '../stock.entity';

export class FilteredStocksDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: () => [Stock] })
  stocks: Stock[];
}
