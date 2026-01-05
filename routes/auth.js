const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.post('/login', async (req, res) => {

    const {password, role} = req.body
    if (!password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Please enter password and role address'
        })
    }

    const user = await User.findOne({ role})
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: 'Invalid password'
        })
    }

    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            familyId: user.familyId._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    )

    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            role: user.role,
            permission: user.permission,
            familyId: user.familyId._id
        }
    })
})

router.get('/roles',  async (req, res) => {
    const {familyId} = req.query
    if (!familyId) {
        return res.status(400).json({
            success: false,
            message: 'No user found'
        })
    }

    const users = await  User.find({ familyId}).select('role name')
    const roles = users.map(user => ({
        value: user.role,
        label: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} (${user.name})`
        })
    )

    res.json({
        success: true,
        roles,
    })
})

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        })
    }
    try {
        const  decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}

module.exports = router
module.exports.verifyToken = verifyToken

