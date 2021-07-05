import { Schema, model, Document, Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { toJSON } from '../utils/toJSON';

export interface IUser {
    login: string;
    pass: string;
    token?: string;
}

export interface IUserDocument extends IUser, Document {
    generateAuthToken(): Promise<string>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 50,
    },
    pass: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = async function (): Promise<string> {
    const user: IUserDocument = this;
    const token = sign(
        {
            _id: user._id.toString(),
        },
        process.env.JWT_SECRET! as string
    );

    // One user = one device!
    user.token = token;

    await user.save();
    return token;
};

userSchema.pre('save', async function (next) {
    const user: IUserDocument = this;
    if (user.isModified('pass')) {
        user.pass = await bcrypt.hash(user.pass, 8);
    }
    next();
});

userSchema.methods.toJSON = toJSON;

export const User = model<IUserDocument, IUserModel>('User', userSchema);
