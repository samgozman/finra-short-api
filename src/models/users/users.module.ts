import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		MongooseModule.forFeature([UserModel]),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
