import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { UsersRepository } from './repositories/users.repository';

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		MongooseModule.forFeature([UserModelDefinition]),
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
