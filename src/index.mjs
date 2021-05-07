import app from './app.mjs'
import './utils/parse.mjs'

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})