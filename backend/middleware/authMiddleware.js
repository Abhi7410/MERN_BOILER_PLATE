const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
// const { TabContext } = require('@mui/lab')

const protect = asyncHandler(async (req, res, next) => {
    
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            // split it from the Bearer and token as only token in token
            token = req.headers.authorization.split(' ')[1]

            //verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            //GEt user from the token

            req.user = await User.findById(decoded.id).select('-password') // for not selecting the password
            next() // calling next piece of middle ware

        } catch (error) {
            console.log(error)
            res.status(401).json({message:'Not authorized'})
        }
    }

    if (!token) {
        res.status(401).json({message:'Not authorized , no token'})
    }
}
)

module.exports = {protect}