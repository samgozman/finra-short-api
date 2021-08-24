import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModelDefinition } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumeModelDefinition } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { FilterModelDefinition } from './schemas/filter.schema';
import { FilterUnitService } from './filter-unit.service';

@Module({
	controllers: [FiltersController],
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			UserModelDefinition,
			FilterModelDefinition,
			StockModelDefinition,
			VolumeModelDefinition,
		]),
	],
	providers: [
		UsersService,
		FiltersService,
		FilterUnitService,
		StocksService,
		VolumesService,
		ConfigService,
	],
	exports: [FiltersService, FilterUnitService],
})
export class FiltersModule {}
