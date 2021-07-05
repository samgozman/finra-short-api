import { Request } from 'express';
import { IUserDocument } from '../models/User';

export interface RequestAuth extends Request {
    token?: string;
    user?: IUserDocument;
}
