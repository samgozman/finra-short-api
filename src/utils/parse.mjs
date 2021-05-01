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

const main = async () => {
    console.log(await getMonthlyPages())
    console.log('')
    console.log(await getLinksToFiles('http://regsho.finra.org/regsho-Index.html'))
}

main()