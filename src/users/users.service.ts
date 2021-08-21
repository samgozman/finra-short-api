import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { IUserDocument, User } from './schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(
		private configService: ConfigService,
		@InjectModel(User.name)
		private readonly userModel: Model<IUserDocument>,
	) {}

	async create(credentials: CreateUserDto) {
		const user = new this.userModel({ ...credentials });

		const token = await user.generateAuthToken(
			this.configService.get('JWT_SECRET'),
		);

		user.token = token;
		await user.save();

		return token;
	}
}
