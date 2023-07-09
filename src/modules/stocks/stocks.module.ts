import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [StocksService],
  controllers: [StocksController],
})
export class StocksModule {}
