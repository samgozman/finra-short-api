import express from 'express'
import compression from 'compression'
import './db/connection.mjs'

const app = express()

app.set('trust proxy', 1)
app.use(compression())

app.use(express.json())

export default app