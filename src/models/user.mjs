import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 50
    },
    pass: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)

    // One user = one device!
    user.token = token

    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('pass')) {
        user.pass = await bcrypt.hash(user.pass, 8)
    }
    next()
})

userSchema.methods.toJSON = function () {
    const data = this
    const dataObj = data.toObject()

    delete dataObj.token

    return dataObj
}

const User = mongoose.model('User', userSchema)

export default User