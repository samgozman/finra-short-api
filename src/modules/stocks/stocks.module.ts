import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Volume } from '../volumes/volume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, User, Volume])],
  providers: [StocksService, UsersService],
  controllers: [StocksController],
})
export class StocksModule {}
