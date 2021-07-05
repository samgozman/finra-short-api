import { verify } from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { Response, NextFunction } from 'express';
import { RequestAuth } from './RequestAuth';

const auth = async (req: RequestAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded = <any>verify(token, process.env.JWT_SECRET as string);
        const user: IUserDocument | null = await User.findOne({
            _id: decoded._id,
            token,
        });
        if (!user) {
            throw new Error();
        }
        // store variable in request
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Please authenticate.',
        });
    }
};

export default auth;
