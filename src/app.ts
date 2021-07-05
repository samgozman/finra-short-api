import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import './db/connection';

import stockRouter from './routers/stock';
import collectionRouter from './routers/collection';
import userRouter from './routers/user';
import topRouter from './routers/top';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());

app.use(express.json());

app.use(stockRouter);
app.use(collectionRouter);
app.use(userRouter);
app.use(topRouter);

export default app;
