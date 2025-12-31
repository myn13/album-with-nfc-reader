const monoose = require('mongoose')
const mongoose = require("mongoose");

const appConfigSchema = new mongoose.Schema({
    googleDriveFolderId: {
        type: String,
        required: true
    },
    settings: {
        requiredNFCToOpen: {
            type: Boolean,
            default: false
        }
    },
    autoRefreshAlbums: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('AppConfig', appConfigSchema)