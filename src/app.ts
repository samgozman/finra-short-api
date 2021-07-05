import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import './db/connection';

import stockRouter from './routers/stockRouter';
import collectionRouter from './routers/collectionRouter';
import userRouter from './routers/userRouter';
import topRouter from './routers/topRouter';

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
