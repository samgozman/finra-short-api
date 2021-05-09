import mongoose from 'mongoose'

const volumeSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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

volumeSchema.index({
    _stock_id: 1,
    date: 1
}, {
    unique: true
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

volumeSchema.methods.toJSON = function () {
    const data = this
    const dataObj = data.toObject()

    delete dataObj._stock_id
    delete dataObj._id
    delete dataObj.id
    delete dataObj.__v

    return dataObj
}

const Volume = mongoose.model('Volume', volumeSchema)
export default Volume