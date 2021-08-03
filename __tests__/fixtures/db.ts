import { Filter } from '../../src/models/Filter';
import { Stock } from '../../src/models/Stock';
import { User, IUser } from '../../src/models/User';
import { Volume } from '../../src/models/Volume';

export const userAdmin = new User({
    login: 'Admin',
    pass: 'test1234',
});

export const setupDB = async () => {
    // Wipe test database before each test
    await User.deleteMany();
    await Volume.deleteMany();
    await Stock.deleteMany();
    await Filter.deleteMany();

    // 1. Setup default user to work with
    userAdmin.token = await userAdmin.generateAuthToken();
    await new User(userAdmin).save();
};
