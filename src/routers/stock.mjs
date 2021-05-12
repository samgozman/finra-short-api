import {
    Router
} from 'express'
import Stock from '../models/stock.mjs'
import auth from '../middleware/auth.mjs'

const stockRouter = new Router()

stockRouter.get('/stock', auth, async (req, res) => {
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
        
        stock.version = process.env.npm_package_version

        res.send(stock)
    } catch (error) {
        res.status(404).send('Stock is not found!')
    }
})

export default stockRouter