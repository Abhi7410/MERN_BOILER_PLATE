const asyncHandler = require('express-async-handler')
const Goal = require('../models/GoalModel')

const getGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.find()

    res.status(200).json(goal)
})


const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        // res.status(400)
        res.status(400).json({message:'Please add a text field'})
        // throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text:req.body.text
    })
    res.status(200).json({ message: 'Set Goals' })
})


const updateGoals = asyncHandler(async (req, res) => {
    
    const goal = await Goal.findById(req.params.id)
    
    if (!goal) {
        res.status(400).json({ message: 'Goal not found' })
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

    await goal.remove()
    res.status(200).json({ message: `Deleted Goal ${req.params.id}` })
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}