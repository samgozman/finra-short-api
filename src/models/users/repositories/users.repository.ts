import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery } from 'mongoose';
import { IUserDocument, User, UserModel } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: UserModel,
	) {}

	new = (doc?: AnyKeys<IUserDocument> & AnyObject) => new this.userModel(doc);

	async findOne(filter: FilterQuery<IUserDocument>) {
		return this.userModel.findOne(filter);
	}

	async find(filter: FilterQuery<IUserDocument>) {
		return this.userModel.find(filter);
	}
}
