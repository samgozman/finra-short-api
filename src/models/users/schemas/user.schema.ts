import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUserDocument extends User, Document {
	generateAuthToken(jwt_secret: string): Promise<string>;
}

export type UserPrivileges = 'admin' | 'screener' | 'stockInfo';

@Schema()
export class User {
	@Prop({ required: true, unique: true, trim: true, maxLength: 50 })
	login: string;

	@Prop({ required: true })
	pass: string;

	@Prop({ default: [] })
	roles: UserPrivileges[];

	@Prop()
	apikey?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
