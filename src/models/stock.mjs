import mongoose from 'mongoose'

const stockSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        unique: true,
        maxLength: 14,
        trim: true,
        set: v => v.replace(/p/g,'-').replace(/\//g, '.')
    }
})

/**
 * Get array of all available stocks
 * @async
 * @return {Array} Array of stocks
 */
stockSchema.statics.avalibleTickers = async function () {
    const stocks = await Stock.find({})
    return stocks.map(a => a._id)
}

stockSchema.virtual('volume', {
    ref: 'Volume',
    localField: '_id',
    foreignField: '_stock_id'
})

const Stock = mongoose.model('Stock', stockSchema)
export default Stock