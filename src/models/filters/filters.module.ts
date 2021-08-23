import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
	controllers: [FiltersController],
	imports: [MongooseModule.forFeature([UserModel])],
	providers: [UsersService, FiltersService],
})
export class FiltersModule {}
