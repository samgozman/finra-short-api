import {
    Router
} from 'express'
import {
    Stock
} from '../models/stock.mjs'
import {
    Volume
} from '../models/volume.mjs'
import {
    getMonthlyPages,
    getLinksToFiles,
    getDataFromFile
} from '../utils/parse.mjs'

const collectionRouter = new Router()

collectionRouter.get('/collection/create', async (req, res) => {
    try {
        const pages = await getMonthlyPages()
        const files = []
        for (const page in pages) {
            const links = await getLinksToFiles(pages[page])
            files.push(...Object.values(links))
        }

        for (const file in files) {
            const reports = await getDataFromFile(files[file])
            let mongoArr = []
            for (const report in reports) {

                // Try to find existing
                let stock = await Stock.findOne({
                    ticker: report
                })

                // If not - create
                if (!stock) {
                    stock = new Stock({
                        ticker: report
                    })
                    await stock.save()
                }

                mongoArr.push({
                    _stock_id: stock._id,
                    ...reports[report]
                })
            }
            await Volume.insertMany(mongoArr)
        }
        

        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }

})

export default collectionRouter