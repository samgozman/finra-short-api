import mongoose from 'mongoose'

const stockSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        maxLength: 14,
        trim: true
    }
})

stockSchema.virtual('volume', {
    ref: 'Volume',
    localField: '_id',
    foreignField: '_stock_id',
    justOne: true
})

export const Stock = mongoose.model('Stock', stockSchema)