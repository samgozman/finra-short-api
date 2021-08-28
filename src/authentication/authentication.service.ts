import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserModel } from '../models/users/schemas/user.schema';
import { UsersService } from '../models/users/users.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthenticationService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: UserModel,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async register(credentials: AuthCredentialsDto) {
		const { login, pass } = credentials;

		const salt = await genSalt();
		const hashedPassword = await hash(pass, salt);

		const user = new this.userModel({ login, pass: hashedPassword });
		return user.save();
	}

	async login(credentials: AuthCredentialsDto) {
		const { login, pass } = credentials;
		const user = await this.usersService.findOne({ login });

		if (user && (await compare(pass, user.pass))) {
			const payload: JwtPayload = { _id: user._id };
			const accessToken = this.jwtService.sign(payload);
			return { accessToken };
		} else {
			throw new UnauthorizedException('Please check your login credentials');
		}
	}
}
