import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from 'src/models/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from 'src/models/users/schemas/user.schema';

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
		MongooseModule.forFeature([UserModel]),
	],
	providers: [AuthenticationService, JwtStrategy, UsersService, ConfigService],
	controllers: [AuthenticationController],
	exports: [JwtStrategy, PassportModule],
})
export class AuthenticationModule {}
