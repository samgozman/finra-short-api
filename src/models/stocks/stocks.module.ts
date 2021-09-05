import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumesRepository } from '../volumes/repositories/volumes.repository';
import { VolumeModelDefinition } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
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
	providers: [
		StocksService,
		UsersService,
		StocksRepository,
		VolumesRepository,
		VolumesService,
	],
	exports: [StocksService],
})
export class StocksModule {}
