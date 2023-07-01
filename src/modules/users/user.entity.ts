import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './enums/user-roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 50,
    unique: true,
  })
  login: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
    default: [UserRoles.stockInfo, UserRoles.screener],
    enum: UserRoles,
  })
  roles: UserRoles[];

  @Column({
    nullable: true,
    default: null,
  })
  apiKey: string;
}
