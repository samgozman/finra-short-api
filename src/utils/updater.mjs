import cron from 'node-cron'

import {
    Volume
} from '../models/volume.mjs'
import {
    getLinksToFiles,
    getDataFromFile,
    processLines
} from '../utils/parse.mjs'

// Run every day except Sunday at 6pm ET (18:00 Moscow time)
cron.schedule('0 18 * * 1-6', async () => {
    try {
        const files = await getLinksToFiles('http://regsho.finra.org/regsho-Index.html')
        const currentDay = files[files.length - 1]
        const reports = await getDataFromFile(currentDay)
        let mongoArr = await processLines(reports)
        await Volume.insertMany(mongoArr)
    } catch (error) {
        console.error('CRON FAILURE!')
    }
}, {
    scheduled: true,
    timezone: 'America/New_York'
})