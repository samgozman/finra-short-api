import '../../src/db/connection';
import { Filter } from '../../src/models/Filter';
import { Stock } from '../../src/models/Stock';
import { User, IUser } from '../../src/models/User';
import { Volume } from '../../src/models/Volume';

export const userAdmin: IUser = {
    login: 'Admin',
    pass: 'test1234',
};

export const setupDB = async () => {
    // Wipe test database before each test
    await User.collection.drop().catch(() => {});
    await Volume.collection.drop().catch(() => {});
    await Stock.collection.drop().catch(() => {});
    await Filter.collection.drop().catch(() => {});

    // 1. Setup default user to work with
    const user = new User(userAdmin);
    user.token = await user.generateAuthToken();
    await new User(user).save();
};
