import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { FilterModelDefinition } from './schemas/filter.schema';

@Module({
	controllers: [FiltersController],
	imports: [
		MongooseModule.forFeature([UserModelDefinition, FilterModelDefinition]),
	],
	providers: [UsersService, FiltersService],
	exports: [FiltersService],
})
export class FiltersModule {}
