import jwt from 'jsonwebtoken'
import User from '../models/user.mjs'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({
            _id: decoded._id,
            token
        })
        if (!user) {
            throw new Error()
        }
        // store variable in request 
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({
            error: 'Please authenticate.'
        })
    }
}

export default auth