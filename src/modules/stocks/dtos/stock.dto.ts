import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Stock } from '../stock.entity';

export class StockDto implements Partial<Stock> {
  @ApiProperty()
  @Expose()
  ticker: string;

  @ApiProperty()
  @Expose()
  shortVolRatioLast: number;

  @ApiProperty()
  @Expose()
  shortExemptVolRatioLast: number;

  @ApiProperty()
  @Expose()
  totalVolLast: number;

  @ApiProperty()
  @Expose()
  shortVolRatio5DAVG: number;

  @ApiProperty()
  @Expose()
  shortExemptVolRatio5DAVG: number;

  @ApiProperty()
  @Expose()
  totalVol5DAVG: number;

  @ApiProperty()
  @Expose()
  shortVolRatio20DAVG: number;

  @ApiProperty()
  @Expose()
  shortExemptVolRatio20DAVG: number;

  @ApiProperty()
  @Expose()
  totalVol20DAVG: number;
}
