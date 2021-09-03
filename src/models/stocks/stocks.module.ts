import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumeModelDefinition } from '../volumes/schemas/volume.schema';
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
			VolumeModelDefinition,
		]),
	],
	providers: [StocksService, UsersService, StocksRepository],
	exports: [StocksService],
})
export class StocksModule {}
