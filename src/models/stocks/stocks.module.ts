import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { StocksRepository } from './repositories/stocks.repository';
import { StockModelDefinition } from './schemas/stock.schema';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
	controllers: [StocksController],
	imports: [
		MongooseModule.forFeature([
			UserModelDefinition,
			StockModelDefinition,
		]),
	],
	providers: [
		StocksService,
		UsersService,
		StocksRepository,
		UsersRepository,
	],
	exports: [StocksService],
})
export class StocksModule {}
