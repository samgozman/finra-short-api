import mongoose from 'mongoose'

const volumeSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    date: {
        type: Date,
        required: true
    },
    shortVolume: {
        type: Number,
        required: true,
        default: 0
    },
    shortExemptVolume: {
        type: Number,
        required: true,
        default: 0
    },
    totalVolume: {
        type: Number,
        required: true,
        default: 0
    }
})

// TODO: Нужно под каждую дату создавать строчку для каждой акции. 
// TODO: Тк в день N может не быть данных по некоторым акциям, то заполняем пустые места нулями. 

export const Volume = mongoose.model('Stock', volumeSchema)