const asyncHandler = require('express-async-handler')
const Goal = require('../models/GoalModel')
const User = require('../models/UserModel')
const getGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.find({user : req.user.id})

    res.status(200).json(goal)
})


const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        // res.status(400)
        res.status(400).json({message:'Please add a text field'})
        // throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })
    res.status(200).json(goal)
})


const updateGoals = asyncHandler(async (req, res) => {
    
    const goal = await Goal.findById(req.params.id)
    
    if (!goal) {
        res.status(400).json({ message: 'Goal not found' })
    }
    const user = await User.findById(req.user.id)
//check for logged in user
    if (!user) {
        res.status(401).json({message : 'User not found'})
    }
// make sure the only the logged in user matches with the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401).json({message:'User not authorized'})
    }

    const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
    }) 
    res.status(200).json({ message: 'Updated Goals' })
})


const deleteGoals = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400).json({ message: 'Goal not found' })
    }
    // Check for user
    if (!req.user) {
        res.status(401).json({message:'User not found'})
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' })
    }

    await goal.remove()
    res.status(200).json({ message: `Deleted Goal ${req.params.id}` })
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}