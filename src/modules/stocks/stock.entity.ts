import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Volume } from '../volumes/volume.entity';

@Entity({
  name: 'stocks',
})
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 14,
    nullable: false,
    unique: true,
    transformer: {
      to(value: string) {
        return value.trim();
      },
      from(value) {
        return value;
      },
    },
  })
  ticker: string;

  @OneToMany(() => Volume, (volume) => volume.stock)
  volumes: Volume[];

  // Ratios (percentages)

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVolRatioLast: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVolRatioLast: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVolRatio5dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVolRatio5dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVolRatio20dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVolRatio20dAvg: number;

  // Numeric avg

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  totalVolLast: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  totalVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  totalVol20dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVolLast: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortExemptVol20dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVolLast: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  shortVol20dAvg: number;

  // ? Presets filters

  /** Filter new stocks with no data or incomplete */
  @Column({
    default: false,
  })
  isNotGarbage: boolean;

  // ? In-line sequence of 5d

  /** Short volume is growing 5 days in a row */
  @Column({
    default: false,
  })
  shortVolGrows5D: boolean;

  /** Short volume is decreasing 5 days in a row */
  @Column({
    default: false,
  })
  shortVolDecreases5D: boolean;

  /** Short volume ratio (%) is growing 5 days in a row */
  @Column({
    default: false,
  })
  shortVolRatioGrows5D: boolean;

  /** Short volume ratio (%) is decreasing 5 days in a row */
  @Column({
    default: false,
  })
  shortVolRatioDecreases5D: boolean;

  /** Total volume is growing 5 days in a row */
  @Column({
    default: false,
  })
  totalVolGrows5D: boolean;

  /** Total volume is decreasing 5 days in a row */
  @Column({
    default: false,
  })
  totalVolDecreases5D: boolean;

  /** Short Exempt volume is growing 5 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolGrows5D: boolean;

  /** Short Exempt volume is decreasing 5 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolDecreases5D: boolean;

  /** Short Exempt volume ratio is growing 5 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolRatioGrows5D: boolean;

  /** Short Exempt volume ratio is decreasing 5 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolRatioDecreases5D: boolean;

  // ? In-line sequence of 3d

  /** Short volume is growing 3 days in a row */
  @Column({
    default: false,
  })
  shortVolGrows3D: boolean;

  /** Short volume is decreasing 3 days in a row */
  @Column({
    default: false,
  })
  shortVolDecreases3D: boolean;

  /** Short volume ratio (%) is growing 3 days in a row */
  @Column({
    default: false,
  })
  shortVolRatioGrows3D: boolean;

  /** Short volume ratio (%) is decreasing 3 days in a row */
  @Column({
    default: false,
  })
  shortVolRatioDecreases3D: boolean;

  /** Total volume is growing 3 days in a row */
  @Column({
    default: false,
  })
  totalVolGrows3D: boolean;

  /** Total volume is decreasing 3 days in a row */
  @Column({
    default: false,
  })
  totalVolDecreases3D: boolean;

  /** Short Exempt volume is growing 3 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolGrows3D: boolean;

  /** Short Exempt volume is decreasing 3 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolDecreases3D: boolean;

  /** Short Exempt volume ratio is growing 3 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolRatioGrows3D: boolean;

  /** Short Exempt volume ratio is decreasing 3 days in a row */
  @Column({
    default: false,
  })
  shortExemptVolRatioDecreases3D: boolean;

  // ? Abnormal volume

  /** Abnormal short volume growing */
  @Column({
    default: false,
  })
  abnormalShortVolGrows: boolean;

  /** Abnormal short volume decreasing */
  @Column({
    default: false,
  })
  abnormalShortVolDecreases: boolean;

  /** Abnormal total volume growing */
  @Column({
    default: false,
  })
  abnormalTotalVolGrows: boolean;

  /** Abnormal total volume decreasing */
  @Column({
    default: false,
  })
  abnormalTotalVolDecreases: boolean;

  /** Abnormal short exempt volume growing */
  @Column({
    default: false,
  })
  abnormalShortExemptVolGrows: boolean;

  /** Abnormal short exempt volume decreasing */
  @Column({
    default: false,
  })
  abnormalShortExemptVolDecreases: boolean;
}

/**
 * Stock filter properties
 */
export type StockFilters = Pick<
  Stock,
  | 'isNotGarbage'
  | 'shortVolGrows5D'
  | 'shortVolDecreases5D'
  | 'shortVolRatioGrows5D'
  | 'shortVolRatioDecreases5D'
  | 'totalVolGrows5D'
  | 'totalVolDecreases5D'
  | 'shortExemptVolGrows5D'
  | 'shortExemptVolDecreases5D'
  | 'shortExemptVolRatioGrows5D'
  | 'shortExemptVolRatioDecreases5D'
  | 'shortVolGrows3D'
  | 'shortVolDecreases3D'
  | 'shortVolRatioGrows3D'
  | 'shortVolRatioDecreases3D'
  | 'totalVolGrows3D'
  | 'totalVolDecreases3D'
  | 'shortExemptVolGrows3D'
  | 'shortExemptVolDecreases3D'
  | 'shortExemptVolRatioGrows3D'
  | 'shortExemptVolRatioDecreases3D'
  | 'abnormalShortVolGrows'
  | 'abnormalShortVolDecreases'
  | 'abnormalTotalVolGrows'
  | 'abnormalTotalVolDecreases'
  | 'abnormalShortExemptVolGrows'
  | 'abnormalShortExemptVolDecreases'
>;

/**
 * Stock object properties (for API)
 */
export type StockObject = Pick<
  Stock,
  | 'ticker'
  // Percent values
  | 'shortVolRatioLast'
  | 'shortExemptVolRatioLast'
  | 'shortVolRatio5dAvg'
  | 'shortExemptVolRatio5dAvg'
  | 'shortVolRatio20dAvg'
  | 'shortExemptVolRatio20dAvg'
  // Numeric
  | 'shortExemptVolLast'
  | 'shortExemptVol5dAvg'
  | 'shortExemptVol20dAvg'
  | 'shortVolLast'
  | 'shortVol5dAvg'
  | 'shortVol20dAvg'
  | 'totalVolLast'
  | 'totalVol5dAvg'
  | 'totalVol20dAvg'
>;

export const filtersArray: (keyof StockFilters)[] = [
  'isNotGarbage',
  'shortVolGrows5D',
  'shortVolDecreases5D',
  'shortVolRatioGrows5D',
  'shortVolRatioDecreases5D',
  'totalVolGrows5D',
  'totalVolDecreases5D',
  'shortExemptVolGrows5D',
  'shortExemptVolDecreases5D',
  'shortExemptVolRatioGrows5D',
  'shortExemptVolRatioDecreases5D',
  'shortVolGrows3D',
  'shortVolDecreases3D',
  'shortVolRatioGrows3D',
  'shortVolRatioDecreases3D',
  'totalVolGrows3D',
  'totalVolDecreases3D',
  'shortExemptVolGrows3D',
  'shortExemptVolDecreases3D',
  'shortExemptVolRatioGrows3D',
  'shortExemptVolRatioDecreases3D',
  'abnormalShortVolGrows',
  'abnormalShortVolDecreases',
  'abnormalTotalVolGrows',
  'abnormalTotalVolDecreases',
  'abnormalShortExemptVolGrows',
  'abnormalShortExemptVolDecreases',
];
export const sortKeysObject: (keyof StockObject)[] = [
  'ticker',
  'shortVolRatioLast',
  'shortExemptVolRatioLast',
  'shortVolRatio5dAvg',
  'shortExemptVolRatio5dAvg',
  'shortVolRatio20dAvg',
  'shortExemptVolRatio20dAvg',
  'shortExemptVolLast',
  'shortExemptVol5dAvg',
  'shortExemptVol20dAvg',
  'shortVolLast',
  'shortVol5dAvg',
  'shortVol20dAvg',
  'totalVolLast',
  'totalVol5dAvg',
  'totalVol20dAvg',
];
