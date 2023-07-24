import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform, plainToInstance } from 'class-transformer';
import { Stock } from '../stock.entity';
import { Volume } from '../../../modules/volumes/volume.entity';

class VolumeDto implements Volume {
  @Exclude()
  id: string;

  @Exclude()
  stockId: string;

  @Exclude()
  stock: Stock;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  shortVolume: number;

  @ApiProperty()
  @Expose()
  shortExemptVolume: number;

  @ApiProperty()
  @Expose()
  totalVolume: number;
}

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

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    return plainToInstance(VolumeDto, obj.volumes);
  })
  volumes: VolumeDto[];
}
