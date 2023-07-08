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
}
