import { Response, NextFunction } from 'express';
import { RequestAuth } from './RequestAuth';

const admin = async (req: RequestAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const isAdmin = token === process.env.ADMIN_KEY;
        if (!isAdmin) {
            throw new Error();
        }
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send();
    }
};

export default admin;
