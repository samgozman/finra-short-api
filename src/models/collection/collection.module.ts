import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { StockModelDefinition } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumeModelDefinition } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { AveragesService } from './averages.service';
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
		]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	providers: [
		CollectionService,
		ParseService,
		AveragesService,
		UsersService,
		StocksService,
		VolumesService,
	],
})
export class CollectionModule {}
