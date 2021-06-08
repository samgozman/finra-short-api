import {
    Router
} from 'express'
import {
    Tinkoff
} from 'tinkoff-api-securities'
import Stock from '../models/stock.mjs'
import auth from '../middleware/auth.mjs'

const topRouter = new Router()

topRouter.get('/top', auth, async (req, res) => {
    try {

        const limit = req.query.limit || 5
        const tinkoffOnly = req.query.tinkoffOnly || 'true'

        const allIds = await Stock.avalibleTickers()
        let top = []

        // Calculate average short volume
        const avgShortVol = (arr) => {
            let sum = 0
            for (const i in arr) {
                sum += arr[i].shortVolume / arr[i].totalVolume * 100
            }
            return (sum / arr.length)
        }

        // Find populate all stocks volumes
        for (const _id of allIds) {
            let stock = await Stock.findById(_id)
            await stock.populate({
                path: 'volume',
                options: {
                    limit,
                    sort: {
                        date: 'desc'
                    }
                }
            }).execPopulate()

            top.push({
                shortVol: avgShortVol(stock.volume),
                ticker: stock.ticker
            })
        }

        // Filter by tinkoff
        if (tinkoffOnly === 'true') {
            const tinkoff = new Tinkoff(process.env.SANDBOX_TOKEN)
            const onTinkoff = await tinkoff.stocks('USD')
            let tinkedArr = []
            for (const tink of onTinkoff) {
                const obj = top.find(x => x.ticker === tink.ticker)
                if (obj) {
                    tinkedArr.push({
                        shortVol: obj.shortVol,
                        ticker: tink.ticker
                    })
                }
            }
            top = tinkedArr
        }

        // Sort from high to low
        top = top.sort(function (a, b) {
            return b.shortVol - a.shortVol
        })

        res.send(top)
    } catch (error) {
        res.status(404).send(error)
    }
})

export default topRouter