import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { FilterModel } from './schemas/filter.schema';

@Module({
	controllers: [FiltersController],
	imports: [MongooseModule.forFeature([UserModel, FilterModel])],
	providers: [UsersService, FiltersService],
	exports: [FiltersService],
})
export class FiltersModule {}
