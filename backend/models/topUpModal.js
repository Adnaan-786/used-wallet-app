const mongoose = require('mongoose')

const topUpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
            minlength: 15,
            maxlength: 15,
        },
        screenshotUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('TopUpRequest', topUpSchema)
