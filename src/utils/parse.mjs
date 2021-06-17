import got from 'got'
import cheerio from 'cheerio'
import moment from 'moment-timezone'

import Stock from '../models/stock.mjs'
import Volume from '../models/volume.mjs'

moment.tz.setDefault('America/New_York')

/**
 * Get pages with monthly data
 * @async
 * @return {Object.<string, string>} Object: 'Mounth Year': 'Link'
 */
export const getMonthlyPages = async () => {
    try {
        const baseUrl = 'http://regsho.finra.org/regsho-Index.html'
        const response = await got(baseUrl)
        const $ = cheerio.load(response.body)

        const menuTable = $('body > table:nth-child(2) > tbody > tr > td')
        let links = {}
        Array.prototype.map.call(menuTable, (td) => {
            const link = $(td).find('a')
            if (link.text()) {
                links[link.text()] = link.attr('href')
            } else {
                // Last / current menu item is empty. 
                const currentPageDate = $('body > table:nth-child(2) > tbody > tr > td').last().text()
                links[currentPageDate] = baseUrl
            }
        })

        return links
    } catch (error) {
        return {
            error: error.message
        }
    }
}

/**
 * Get links to the monthly reports
 * @async
 * @param url Link to the monthly page
 * @return {Object.<string, string>} Object: 'DayOfTheWeek Day': 'Link'
 */
export const getLinksToFiles = async (url) => {
    try {
        const response = await got(url)
        const $ = cheerio.load(response.body)

        const filePathsNode = $('ul').first().find('li > a').toArray().reverse()
        let filePaths = {}
        Array.prototype.map.call(filePathsNode, (a) => {
            const link = $(a)
            filePaths[link.text()] = link.attr('href')
        })

        return filePaths
    } catch (error) {
        return {
            error: error.message
        }
    }
}

/**
 * @typedef {Object} FinraReport
 * @property {Date} date Date of record
 * @property {Number} shortVolume Short volume
 * @property {Number} shortExemptVolume Short exempt volume
 * @property {Number} totalVolume Total volume
 */

/**
 * Get Finra short report for each stock
 * @async
 * @param url Link to the report file (.txt)
 * @return {Object.<string, FinraReport>} Object: ticker: FinraReport
 */
export const getDataFromFile = async (url) => {
    const response = await got(url)
    const text = response.body.toString()
    let textArray = text.split(/\r?\n/)

    // Remove first and last 2 lines of the array
    textArray.shift()
    textArray.pop()
    textArray.pop()

    let obj = {}
    textArray.forEach((str) => {
        // String format: Date|Symbol|ShortVolume|ShortExemptVolume|TotalVolume|Market
        const strArr = str.split('|')
        obj[strArr[1]] = {
            date: new Date(moment(strArr[0], 'YYYYMMDD')),
            shortVolume: +strArr[2],
            shortExemptVolume: +strArr[3],
            totalVolume: +strArr[4]
            // nyse: /N/g.test(strArr[5]),
            // nasdaqCarteret: /Q/g.test(strArr[5]),
            // nasdaqChicago: /B/g.test(strArr[5]),
            // adf: /D/g.test(strArr[5])
        }
    })

    return obj
}

/**
 * @async
 * @return {Array} Array of dates
 */
export const getTradingDays = async () => {
    const pages = await getMonthlyPages()
    const fullDateObj = []
    for (const page in pages) {
        const daysObj = await getLinksToFiles(pages[page])
        Object.keys(daysObj).forEach((el) => {
            const date = moment(+el.replace(/[A-z ]/g, '') + ' ' + page, 'DD MMM YYYY')
            fullDateObj.push(date)
        })
    }

    return fullDateObj
}

/**
 * @async
 * @return {Array.<FinraReport>} Array of FinraReport objects
 */
export const processLines = async (reports = []) => {
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

    return mongoArr
}

export const updateLastTradingDay = async () => {
    const files = await getLinksToFiles('http://regsho.finra.org/regsho-Index.html')
    const {
        [Object.keys(files).pop()]: currentDay
    } = files
    const reports = await getDataFromFile(currentDay)
    let mongoArr = await processLines(reports)
    await Volume.insertMany(mongoArr)
}