const asyncHandler = require('express-async-handler')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

// @desc    Request to Sell USDT
// @route   POST /api/sell/request
// @access  Private
const requestSell = asyncHandler(async (req, res) => {
    const { country, unitPrice, totalUnits, paymentMethod, password } = req.body
    const ADMIN_MAX_PRICE = 90 // Example variable

    if (!country || !unitPrice || !totalUnits || !paymentMethod || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    if (unitPrice > ADMIN_MAX_PRICE) {
        res.status(400)
        throw new Error(`Unit price cannot exceed ${ADMIN_MAX_PRICE}`)
    }

    const userId = req.user.id
    const sellAmount = Number(totalUnits)

    // Verify Password
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401)
        throw new Error('Invalid password')
    }

    // Transactional: Check balance, deduct, create sell record
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Get Wallet
            const wallet = await prisma.wallet.findUnique({
                where: { user_id: userId },
            })

            if (!wallet) {
                throw new Error('Wallet not found')
            }

            if (Number(wallet.balance_available) < sellAmount) {
                throw new Error('Insufficient available balance')
            }

            // 2. Update Wallet (Deduct available, Add to frozen)
            const newAvailable = Number(wallet.balance_available) - sellAmount
            const newFrozen = Number(wallet.balance_frozen) + sellAmount

            await prisma.wallet.update({
                where: { user_id: userId },
                data: {
                    balance_available: newAvailable,
                    balance_frozen: newFrozen,
                },
            })

            // 3. Create Sell Record (Trade)
            // Assuming 'Trade' model is used for Sells as per schema.prisma
            const trade = await prisma.trade.create({
                data: {
                    user_id: userId,
                    country,
                    unit_price: unitPrice,
                    units: sellAmount,
                    total_amount_local: sellAmount * unitPrice,
                    payment_method_details: paymentMethod, // JSON
                    status: 'PROCESSING',
                },
            })

            return trade
        })

        res.status(201).json(result)

    } catch (error) {
        console.error(error)
        res.status(400)
        throw new Error(error.message || 'Sell request failed')
    }
})

// @desc    Admin Action on Sell Request
// @route   POST /api/sell/action/:id
// @access  Private/Admin
const adminActionSell = asyncHandler(async (req, res) => {
    const { action } = req.body // 'Approve' or 'Reject'
    const { id } = req.params

    const trade = await prisma.trade.findUnique({
        where: { id: Number(id) },
    })

    if (!trade) {
        res.status(404)
        throw new Error('Sell request not found')
    }

    if (trade.status !== 'PROCESSING') {
        res.status(400)
        throw new Error('Request is already processed')
    }

    const userId = trade.user_id
    const amount = Number(trade.units)

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const wallet = await prisma.wallet.findUnique({
                where: { user_id: userId },
            })

            if (!wallet) throw new Error('User wallet not found')

            if (action === 'Approve') {
                // Burn frozen funds (Total balance decreases)
                const newFrozen = Number(wallet.balance_frozen) - amount
                const newTotal = Number(wallet.balance_total) - amount

                await prisma.wallet.update({
                    where: { user_id: userId },
                    data: {
                        balance_frozen: newFrozen,
                        balance_total: newTotal,
                    },
                })

                const updatedTrade = await prisma.trade.update({
                    where: { id: Number(id) },
                    data: { status: 'COMPLETED' },
                })
                return updatedTrade

            } else if (action === 'Reject') {
                // Refund frozen funds to available (Total balance stays same)
                const newFrozen = Number(wallet.balance_frozen) - amount
                const newAvailable = Number(wallet.balance_available) + amount

                await prisma.wallet.update({
                    where: { user_id: userId },
                    data: {
                        balance_frozen: newFrozen,
                        balance_available: newAvailable,
                    },
                })

                const updatedTrade = await prisma.trade.update({
                    where: { id: Number(id) },
                    data: { status: 'FAILED' },
                })
                return updatedTrade
            } else {
                throw new Error('Invalid action')
            }
        })

        res.status(200).json(result)

    } catch (error) {
        console.error(error)
        res.status(400)
        throw new Error(error.message || 'Action failed')
    }
})

// @desc    Get Pending Sell Requests (Admin only)
// @route   GET /api/sell/pending
// @access  Private/Admin
const getPendingSells = asyncHandler(async (req, res) => {
    const requests = await prisma.trade.findMany({
        where: { status: 'PROCESSING' },
        include: { user: true },
        orderBy: { created_at: 'desc' },
    })
    res.status(200).json(requests)
})

module.exports = {
    requestSell,
    adminActionSell,
    getPendingSells,
}
