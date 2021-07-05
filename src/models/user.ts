import { Schema, model, Document } from 'mongoose';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface IUser {
    login: string;
    pass: string;
    token?: string;
}

export interface IUserDocument extends IUser, Document {
    generateAuthToken(): Promise<string>;
}

const userSchema = new Schema<IUserDocument>({
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

userSchema.methods.toJSON = function () {
    const data: IUserDocument = this;
    const dataObj = data.toObject();

    delete dataObj.token;

    return dataObj;
};

const User = model('User', userSchema);

export default User;
