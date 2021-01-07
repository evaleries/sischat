const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
    message: {
        type: mongoose.Schema.Type.ObjectId,
        ref: 'message',
        required: true
    },
    path: {
        type: String,
        required: true  
    },
    extension: {
        type: String,
        required: true
    },
}, {timestamps: true})


module.exports = mongoose.model('attachment', AttachmentSchema);
