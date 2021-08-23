import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
	controllers: [FiltersController],
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UsersService, FiltersService],
})
export class FiltersModule {}
