import Router from 'express'
import Volume from '../models/volume.mjs'
import {
    getMonthlyPages,
    getLinksToFiles,
    getDataFromFile,
    processLines
} from '../utils/parse.mjs'
import admin from '../middleware/admin.mjs'

const collectionRouter = new Router()

collectionRouter.get('/collection/recreate', admin, async (req, res) => {
    try {
        const pages = await getMonthlyPages()
        const files = []

        // Get links to reports
        for (const page in pages) {
            const links = await getLinksToFiles(pages[page])
            files.push(...Object.values(links))
        }

        // Process files
        for (const file in files) {
            const reports = await getDataFromFile(files[file])
            let mongoArr = await processLines(reports)
            await Volume.insertMany(mongoArr)
        }
        
        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

export default collectionRouter