import app from './app.mjs'
import './utils/updater.mjs'

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})