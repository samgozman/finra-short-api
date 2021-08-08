import { Router, Response } from 'express';
import { User, IUserDocument } from '../models/User';
import admin from '../middleware/admin';
import { RequestAuth } from '../middleware/RequestAuth';

const userRouter = Router();

userRouter.post('/user/add', admin, async (req: RequestAuth, res: Response) => {
    try {
        const login = req.body.login;
        const user: IUserDocument = new User({
            login: login,
            pass: Math.random().toString(36).substr(2, 8),
        });
        const token = await user.generateAuthToken();
        user.token = token;
        await user.save();
        return res.status(201).send({
            login,
            token,
        });
    } catch (error) {
        return res.status(404).send();
    }
});

// List users
userRouter.get('/user/list', admin, async (req: RequestAuth, res: Response) => {
    try {
        const users = await User.find(
            {},
            {
                login: 1,
                _id: 0,
            }
        );

        return res.send(users);
    } catch (error) {
        return res.status(404).send();
    }
});

export default userRouter;
