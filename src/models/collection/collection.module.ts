import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
	controllers: [CollectionController],
	imports: [
		MongooseModule.forFeature([UserModel]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	providers: [CollectionService, UsersService],
})
export class CollectionModule {}
