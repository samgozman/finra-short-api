import { Document } from 'mongoose';
interface HiddenProperties {
    _stock_id?: any;
    token?: any;
}

export const toJSON = function <T extends HiddenProperties & Document>(this: T) {
    const data: T = this;
    const dataObj = data.toObject();

    delete dataObj.token;
    delete dataObj._stock_id;
    delete dataObj._id;
    delete dataObj.id;
    delete dataObj.__v;

    return dataObj;
};
