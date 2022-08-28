//jwt authentication
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')

//Post request

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400).json({message:'Please add all fields'})
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).json({ message:'Already Exists'})
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    //Create user

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
            // password:user.password
        })
    } else {
        res.status(400).json({message:'Invalid User data'})
    }
    res.status(200).json({message:'Registered user'})
})

//porst request 
const loginUser = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
            // password:user.password
        })
    } else {
        res.status(400).json({ message: 'Invalid Credentials' })
    }
    res.status(200).json({ message: 'Login user' })
})

const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)
    // this req.user is authenticated 
    
    res.status(200).json({
        _id,
        name,
        email
    })
    // res.status(200).json({ message: 'User Display' })
})


// for generating JWT token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:'30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}