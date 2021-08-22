import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUserDocument extends User, Document {
	generateAuthToken(jwt_secret: string): Promise<string>;
}

/** Grant access to the hidden resources */
export class UserPrivileges {
	/** User admin privileges (get access to the hidden requests) */
	admin: boolean;
	screener: boolean;
	stockInfo: boolean;
}

/** Default values for user privileges */
const defaultPrivileges: UserPrivileges = {
	admin: false,
	screener: false,
	stockInfo: false,
};

@Schema()
export class User {
	@Prop({ required: true, unique: true, trim: true, maxLength: 50 })
	login: string;

	@Prop({ required: true })
	pass: string;

	@Prop({ type: UserPrivileges, default: defaultPrivileges })
	privileges: UserPrivileges;

	@Prop()
	apikey?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
