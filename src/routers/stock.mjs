import {
    Router
} from 'express'
import {
    Stock
} from '../models/stock.mjs'

const stockRouter = new Router()

stockRouter.get('/stock', async (req, res) => {
    try {
        let ticker = req.query.ticker
        let stock = await Stock.findOne({
            ticker
        })
        await stock.populate(['volume']).execPopulate()
        stock = stock.toJSON({
            virtuals: true
        })

        delete stock._id
        delete stock.id
        delete stock.__v
        
        res.send(stock)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

export default stockRouter