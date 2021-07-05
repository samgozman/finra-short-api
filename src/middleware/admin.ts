import { verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { RequestAuth } from './RequestAuth';

const admin = async (req: RequestAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const isAdmin = verify(token, process.env.JWT_SECRET! as string);

        if (!isAdmin) {
            throw new Error();
        }
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Admin access only!',
        });
    }
};

export default admin;
