import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from '../models/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from '../models/users/schemas/user.schema';
import { UsersRepository } from '../models/users/repositories/users.repository';

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: 3600,
				},
			}),
		}),
		MongooseModule.forFeature([UserModelDefinition]),
	],
	providers: [
		AuthenticationService,
		JwtStrategy,
		UsersService,
		ConfigService,
		UsersRepository,
	],
	controllers: [AuthenticationController],
	exports: [JwtStrategy, PassportModule],
})
export class AuthenticationModule {}
