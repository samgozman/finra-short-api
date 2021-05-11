import jwt from 'jsonwebtoken'

const admin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const isAdmin = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!isAdmin) {
            throw new Error()
        }

        req.token = token
        next()
    } catch (error) {
        res.status(401).send({
            error: 'Admin access only!'
        })
    }
}

export default admin