import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
	controllers: [StocksController],
	imports: [MongooseModule.forFeature([UserModel])],
	providers: [StocksService, UsersService],
})
export class StocksModule {}
