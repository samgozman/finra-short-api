import express from 'express'
import compression from 'compression'
import './db/connection.mjs'

import stockRouter from './routers/stock.mjs'
import collectionRouter from './routers/collection.mjs'
import userRouter from './routers/user.mjs'

const app = express()

app.set('trust proxy', 1)
app.use(compression())

app.use(express.json())

app.use(stockRouter)
app.use(collectionRouter)
app.use(userRouter)

export default app