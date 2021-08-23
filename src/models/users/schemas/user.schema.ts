import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUserDocument extends User, Document {}

export enum UserRules {
	admin,
	screener,
	stockInfo,
}

export type UserPrivileges = keyof typeof UserRules;

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

/** Model definition for MongooseModule usage */
export const UserModel: ModelDefinition = {
	name: User.name,
	schema: UserSchema,
};
