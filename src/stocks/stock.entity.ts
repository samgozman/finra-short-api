import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // Ratios (percentages)

  @Column({
    type: 'float',
    nullable: false,
  })
  shortVolRatioLast: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVolRatioLast: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortVolRatio5dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVolRatio5dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortVolRatio20dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVolRatio20dAvg: number;

  // Numeric avg

  @Column({
    type: 'float',
    nullable: false,
  })
  totalVolLast: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  totalVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  totalVol20dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVolLast: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortExemptVol20dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortVolLast: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  shortVol5dAvg: number;

  @Column({
    type: 'float',
    nullable: false,
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
