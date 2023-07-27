import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform, plainToInstance } from 'class-transformer';
import { Stock, StockObject } from '../stock.entity';
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

export class StockDto implements StockObject {
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
  shortVolRatio5dAvg: number;

  @ApiProperty()
  @Expose()
  shortExemptVolRatio5dAvg: number;

  @ApiProperty()
  @Expose()
  shortVolRatio20dAvg: number;

  @ApiProperty()
  @Expose()
  shortExemptVolRatio20dAvg: number;

  @ApiProperty()
  @Expose()
  shortExemptVolLast: number;

  @ApiProperty()
  @Expose()
  shortExemptVol5dAvg: number;

  @ApiProperty()
  @Expose()
  shortExemptVol20dAvg: number;

  @ApiProperty()
  @Expose()
  shortVolLast: number;

  @ApiProperty()
  @Expose()
  shortVol5dAvg: number;

  @ApiProperty()
  @Expose()
  shortVol20dAvg: number;

  @ApiProperty()
  @Expose()
  totalVolLast: number;

  @ApiProperty()
  @Expose()
  totalVol5dAvg: number;

  @ApiProperty()
  @Expose()
  totalVol20dAvg: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    return plainToInstance(VolumeDto, obj.volumes);
  })
  volumes: VolumeDto[];
}
