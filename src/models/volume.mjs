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

/**
 * Get obj by _stock_id
 * @async
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @return {Object} MongoDB saved model
 */
volumeSchema.statics.findByStockId = async function (_stock_id) {
    try {
        let instance = await this.findOne({
            _stock_id
        })

        if (!instance) {
            throw new Error()
        }

        return instance
    } catch (error) {
        return {
            error: 'Error in static findByStockId()'
        }
    }
}

// TODO: Нужно под каждую дату создавать строчку для каждой акции. 
// TODO: Тк в день N может не быть данных по некоторым акциям, то заполняем пустые места нулями. 

export const Volume = mongoose.model('Stock', volumeSchema)