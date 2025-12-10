const asyncHandler = require('express-async-handler')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

// @desc    Request Withdrawal
// @route   POST /api/withdraw/request
// @access  Private
const requestWithdraw = asyncHandler(async (req, res) => {
    const { amount, wallet_address, password } = req.body

    if (!amount || !wallet_address || !password) {
        res.status(400)
        throw new Error('Please add amount, wallet address and password')
    }

    const userId = req.user.id
    const withdrawAmount = Number(amount)

    // Verify Password
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401)
        throw new Error('Invalid password')
    }

    // Transactional: Check balance, deduct, create withdrawal record
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Get Wallet
            const wallet = await prisma.wallet.findUnique({
                where: { user_id: userId },
            })

            if (!wallet) {
                throw new Error('Wallet not found')
            }

            if (Number(wallet.balance_available) < withdrawAmount) {
                throw new Error('Insufficient available balance')
            }

            // 2. Update Wallet (Deduct available, Add to frozen)
            // Note: Prisma Decimal operations might need special handling if not automatically mapped to JS numbers/strings correctly, 
            // but usually Number() works for simple checks. For precision, we should use Decimal.js if needed, 
            // but here we rely on Prisma's handling or simple arithmetic for now.
            // Better to use atomic updates if possible, but Prisma doesn't support atomic increment/decrement on Decimals easily in all versions without raw query or update with data.
            // We will calculate new values.

            const newAvailable = Number(wallet.balance_available) - withdrawAmount
            const newFrozen = Number(wallet.balance_frozen) + withdrawAmount

            await prisma.wallet.update({
                where: { user_id: userId },
                data: {
                    balance_available: newAvailable,
                    balance_frozen: newFrozen,
                },
            })

            // 3. Create Withdrawal Record
            const order_no = `WTH-${Date.now()}-${Math.floor(Math.random() * 1000)}`

            const withdrawal = await prisma.withdrawal.create({
                data: {
                    user_id: userId,
                    amount: withdrawAmount,
                    order_no,
                    wallet_address,
                    status: 'PROCESSING',
                },
            })

            return withdrawal
        })

        res.status(201).json(result)

    } catch (error) {
        console.error(error)
        res.status(400)
        throw new Error(error.message || 'Withdrawal request failed')
    }
})

// @desc    Admin Action on Withdrawal
// @route   POST /api/withdraw/action/:id
// @access  Private/Admin
const adminActionWithdraw = asyncHandler(async (req, res) => {
    const { action } = req.body // 'Approve' or 'Reject'
    const { id } = req.params

    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: Number(id) },
    })

    if (!withdrawal) {
        res.status(404)
        throw new Error('Withdraw request not found')
    }

    if (withdrawal.status !== 'PROCESSING') {
        res.status(400)
        throw new Error('Request is already processed')
    }

    const userId = withdrawal.user_id
    const amount = Number(withdrawal.amount)

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

                const updatedWithdrawal = await prisma.withdrawal.update({
                    where: { id: Number(id) },
                    data: { status: 'COMPLETED' },
                })
                return updatedWithdrawal

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

                const updatedWithdrawal = await prisma.withdrawal.update({
                    where: { id: Number(id) },
                    data: { status: 'FAILED' },
                })
                return updatedWithdrawal
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

// @desc    Get Pending Withdraw Requests (Admin only)
// @route   GET /api/withdraw/pending
// @access  Private/Admin
const getPendingWithdraws = asyncHandler(async (req, res) => {
    const requests = await prisma.withdrawal.findMany({
        where: { status: 'PROCESSING' },
        include: { user: true },
        orderBy: { created_at: 'desc' },
    })
    res.status(200).json(requests)
})

// @desc    Get My Withdrawals
// @route   GET /api/withdrawals/my
// @access  Private
const getMyWithdrawals = asyncHandler(async (req, res) => {
    const requests = await prisma.withdrawal.findMany({
        where: { user_id: req.user.id },
        orderBy: { created_at: 'desc' },
    })
    res.status(200).json(requests)
})

module.exports = {
    requestWithdraw,
    adminActionWithdraw,
    getPendingWithdraws,
    getMyWithdrawals,
}
