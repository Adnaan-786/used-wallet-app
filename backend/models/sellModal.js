const mongoose = require('mongoose')

const sellSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        country: {
            type: String,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        totalUnits: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            method: {
                type: String,
                enum: ['Bank', 'UPI'],
                required: true,
            },
            details: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('SellRequest', sellSchema)
