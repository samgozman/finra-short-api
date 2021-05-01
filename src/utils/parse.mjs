import got from 'got'
import cheerio from 'cheerio'

const getMonthlyPages = async () => {
    try {
        const currentLink = 'http://regsho.finra.org/regsho-Index.html'
        const response = await got(currentLink)
        const $ = cheerio.load(response.body)

        const menuTable = $('body > table:nth-child(2) > tbody > tr > td')
        const links = Array.prototype.map.call(menuTable, (td) => {
            const link = $(td).find('a')
            if (link.text()) {
                return {
                    [link.text()]: link.attr('href')
                }
            } else {
                // Last / current menu item is empty. 
                const currentPageDate = $('body > table:nth-child(2) > tbody > tr > td').last().text()
                return {
                    [currentPageDate]: currentLink
                }
            }
        })

        return links
    } catch (error) {
        return {
            error: error.message
        }
    }
}

const main = async () => {
    console.log(await getMonthlyPages())
}

main()