import express from 'express'
import compression from 'compression'
import './db/connection.mjs'

import stockRouter from './routers/stock.mjs'

const app = express()

app.set('trust proxy', 1)
app.use(compression())

app.use(express.json())

app.use(stockRouter)

export default app