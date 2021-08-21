import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends User, Document {
	generateAuthToken(jwt_secret: string): Promise<string>;
}

@Schema()
export class User {
	@Prop({ required: true, unique: true, trim: true, maxLength: 50 })
	login: string;

	@Prop({ required: true })
	pass: string;

	@Prop({ required: true })
	token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateAuthToken = async function (
	jwt_secret: string,
): Promise<string> {
	const user = this as IUserDocument;
	const token = sign(
		{
			_id: user._id.toString(),
		},
		jwt_secret,
	);

	// One user = one device!
	user.token = token;

	await user.save();
	return token;
};

UserSchema.pre('save', async function (next) {
	const user = this as IUserDocument;
	if (user.isModified('pass')) {
		user.pass = await bcrypt.hash(user.pass, 8);
	}
	next();
});
