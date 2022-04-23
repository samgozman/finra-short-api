import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { FilterUnitService } from '../filters/filter-unit.service';
import { FiltersService } from '../filters/filters.service';
import { FiltersRepository } from '../filters/repositories/filters.repository';
import { FilterModelDefinition } from '../filters/schemas/filter.schema';
import { StocksRepository } from '../stocks/repositories/stocks.repository';
import { StockModelDefinition } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumesRepository } from '../volumes/repositories/volumes.repository';
import { VolumeModelDefinition } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { ParseService } from './parse.service';

@Module({
	controllers: [CollectionController],
	imports: [
		MongooseModule.forFeature([
			UserModelDefinition,
			StockModelDefinition,
			VolumeModelDefinition,
			FilterModelDefinition,
		]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		HttpModule,
	],
	providers: [
		StocksRepository,
		FiltersRepository,
		VolumesRepository,
		UsersRepository,
		CollectionService,
		ParseService,
		FilterUnitService,
		FiltersService,
		UsersService,
		StocksService,
		VolumesService,
	],
})
export class CollectionModule {}
