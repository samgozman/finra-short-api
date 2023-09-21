import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stock } from '../stocks/stock.entity';

@Entity({
  name: 'volumes',
})
export class Volume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Add index to date to speed up queries
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

  @Column('uuid')
  stockId: string;

  @ManyToOne(() => Stock, (stock) => stock.volumes, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'stockId' })
  stock: Stock;
}
