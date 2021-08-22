import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IUserDocument, User } from './schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<IUserDocument>,
	) {}

	findOne(filter: FilterQuery<IUserDocument>) {
		return this.userModel.findOne(filter);
	}

	listAllUsers() {
		return this.userModel.find({});
	}
}
