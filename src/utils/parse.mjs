import got from 'got'
import cheerio from 'cheerio'

const getMonthlyPages = async () => {
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

const getLinksToFiles = async (url) => {
    try {
        const response = await got(url)
        const $ = cheerio.load(response.body)

        const filePathsNode = $('ul').first().find('li > a')
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

const getDataFromFile = async (url) => {
    const response = await got(url)
    const text = response.body.toString()
    let textArray = text.split(/\r?\n/)

    // Remove first and last line of the array
    textArray.shift()
    textArray.pop()
    textArray.pop()

    let obj = {}
    textArray.forEach((str) => {
        // String format: Date|Symbol|ShortVolume|ShortExemptVolume|TotalVolume|Market
        const strArr = str.split('|')
        obj[strArr[1]] = {
            date: strArr[0],
            shortVolume: +strArr[2],
            shortExemptVolume: +strArr[3],
            totalVolume: +strArr[4],
            nyse: /N/g.test(strArr[5]),
            nasdaqCarteret: /Q/g.test(strArr[5]),
            nasdaqChicago: /B/g.test(strArr[5]),
            adf: /D/g.test(strArr[5])
        }
    })
    
    return obj
}

const main = async () => {
    console.log(await getMonthlyPages())
    console.log('')
    console.log(await getLinksToFiles('http://regsho.finra.org/regsho-Index.html'))
    console.log(await getDataFromFile('http://regsho.finra.org/CNMSshvol20210401.txt'))
}

main()