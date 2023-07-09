import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stock } from '../stocks/stock.entity';

@Entity({
  name: 'volumes',
})
export class Volume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    nullable: false,
    default: 0,
  })
  shortVolume: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  shortExemptVolume: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  totalVolume: number;

  @ManyToOne(() => Stock, (stock) => stock.volumes)
  stock: Stock;
}
