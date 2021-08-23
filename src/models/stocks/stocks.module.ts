import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { StockModel } from './schemas/stock.schema';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
	controllers: [StocksController],
	imports: [MongooseModule.forFeature([UserModel, StockModel])],
	providers: [StocksService, UsersService],
	exports: [StocksService],
})
export class StocksModule {}
