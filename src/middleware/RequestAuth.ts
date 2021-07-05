import { Request } from 'express';
import { IUserDocument } from '../models/user';

export interface RequestAuth extends Request {
    token?: string;
    user?: IUserDocument;
}
