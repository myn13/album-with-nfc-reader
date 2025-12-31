const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['mom', 'dad', 'uncle', 'aunt', 'grandmom', 'granddad', 'guest'],
    },
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true
    },
    permissions: {
        canWrite: {type: Boolean, default: false},
        canDelete: {type: Boolean, default: false},
        canManageUser: {type: Boolean, default: false},
    },
    lastLogin: Date //created and updated at
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)