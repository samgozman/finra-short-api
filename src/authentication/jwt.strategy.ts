import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../models/users/schemas/user.schema';
import { UsersService } from '../models/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
	) {
		super({
			secretOrKey: configService.get('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { _id } = payload;
		const user: User = await this.usersService.findOne({ _id });

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
