import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { StockModel } from '../stocks/schemas/stock.schema';
import { StocksService } from '../stocks/stocks.service';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { VolumeModel } from '../volumes/schemas/volume.schema';
import { VolumesService } from '../volumes/volumes.service';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { ParseService } from './parse.service';

@Module({
	controllers: [CollectionController],
	imports: [
		MongooseModule.forFeature([UserModel, StockModel, VolumeModel]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	providers: [
		CollectionService,
		ParseService,
		UsersService,
		StocksService,
		VolumesService,
	],
})
export class CollectionModule {}
