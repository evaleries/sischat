const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    is_retracted: {
        type: Boolean,
        default: false
    },
    attachments: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'attachment'}
    ]
}, {timestamps: true});

MessageSchema.methods.retract = async function () {
    this.content = 'PESAN TELAH DITARIK';
    this.is_retracted = true;
    this.save();
};


module.exports = mongoose.model('message', MessageSchema);
