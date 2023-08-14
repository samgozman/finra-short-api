import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Volume } from '../volumes/volume.entity';
import { Stock } from '../stocks/stock.entity';
import { PassportModule } from '@nestjs/passport';
import { ParseService } from './parse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Volume, Stock]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DataController],
  providers: [DataService, ParseService, UsersService],
})
export class DataModule {}
