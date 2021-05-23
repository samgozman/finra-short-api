import {
    Router
} from 'express'
import Stock from '../models/stock.mjs'
import auth from '../middleware/auth.mjs'

const stockRouter = new Router()

stockRouter.get('/stock', auth, async (req, res) => {
    try {
        const ticker = req.query.ticker
        const limit = req.query.limit
        const sort = req.query.sort

        let stock = await Stock.findOne({
            ticker
        })

        await stock.populate({
            path: 'volume',
            options: {
                limit,
                sort: {
                    date: sort || 'asc'
                }
            }
        }).execPopulate()

        stock = stock.toJSON({
            virtuals: true
        })

        delete stock._id
        delete stock.id
        delete stock.__v

        stock.version = process.env.npm_package_version

        res.send(stock)
    } catch (error) {
        res.status(404).send('Stock is not found!')
    }
})

export default stockRouter