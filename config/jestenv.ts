import path from 'path';
import dotenv from 'dotenv';

// Setup env fot jest testing
module.exports = async () => {
    dotenv.config({ path: path.resolve(__dirname, 'test.env') });
};
