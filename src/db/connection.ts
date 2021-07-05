import mongoose from 'mongoose';

const connection = mongoose.connect(process.env.MONGODB_CONNECTION_URL! as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

export default connection;
