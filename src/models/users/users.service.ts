import {
	BadRequestException,
	ConflictException,
	ImATeapotException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { genSalt, hash } from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { IUserDocument, User, UserModel } from './schemas/user.schema';
import { UpdateRolesDto } from './dtos/update-roles.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: UserModel,
	) {}

	findOne(filter: FilterQuery<IUserDocument>) {
		return this.userModel.findOne(filter);
	}

	listAllUsers() {
		return this.userModel.find({});
	}

	async createApiKey(login: string) {
		// 1 - find user
		const user = await this.findOne({ login });
		if (!user) {
			throw new NotFoundException('User is not found');
		}

		// 2 - check user privilages.
		//     If the user don't have any - he doesn't need an API key
		if (user.roles.length === 0) {
			throw new ImATeapotException(
				'The user has no more rights than the coffee machine.',
			);
		}

		// 3 - Generate API key
		const apikey = randomBytes(32).toString('hex');

		// 4 - Hash API key
		const salt = await genSalt();
		const hashedApikey = await hash(apikey, salt);

		// 5 - Store Hashed API key in users collection
		user.apikey = hashedApikey;
		await user.save();

		// 6 - Return API key
		return { apikey: `${login}:${apikey}` };
	}

	async updateRoles(updateRolesDto: UpdateRolesDto) {
		// Check roles. They should contains only predefined values
		const { login, role } = updateRolesDto;
		if (role === 'admin') {
			throw new BadRequestException('You can not set admin roles via request');
		}

		const user = await this.findOne({ login });

		if (!user) {
			throw new NotFoundException('User is not found');
		}

		if (user.roles.includes(role)) {
			throw new ConflictException(
				`'${role}' role is allready exists in user object`,
			);
		}

		user.roles.push(role);
		return user.save();
	}
}