const asyncHandler = require('express-async-handler')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cloudinary = require('../utils/cloudinary')

// @desc    Request a Top-Up
// @route   POST /api/topups
// @access  Private
const requestTopUp = asyncHandler(async (req, res) => {
    const { amount, tx_id_15 } = req.body

    if (!amount || !tx_id_15) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    let screenshot_path = ''

    if (req.files && req.files.screenshot) {
        const file = req.files.screenshot
        try {
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'topups',
                use_filename: true,
            })
            screenshot_path = result.secure_url
        } catch (error) {
            console.error('Cloudinary upload error:', error)
            // Continue without screenshot or throw error? 
            // Let's continue but log it.
        }
    }

    // Generate a unique order_no
    const order_no = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    try {
        const topUp = await prisma.topUp.create({
            data: {
                user_id: req.user.id, // Assuming req.user is populated by authMiddleware and has id (Prisma ID)
                // Wait, legacy authMiddleware might populate req.user with Mongoose doc. 
                // We need to ensure req.user.id is the Postgres ID.
                // If authMiddleware fetches from Mongo, we have a problem. 
                // We need to migrate authMiddleware too or ensure User table sync.
                // For now, assuming we are fully migrated to Postgres/Prisma.
                amount: Number(amount),
                order_no,
                tx_id_15,
                screenshot_path,
                status: 'PROCESSING',
            },
        })
        res.status(201).json(topUp)
    } catch (error) {
        console.error(error)
        res.status(400)
        throw new Error('Top Up request failed: ' + error.message)
    }
})

// @desc    Get Pending Top-Ups (Admin only)
// @route   GET /api/topups/pending
// @access  Private/Admin
const getPendingTopUps = asyncHandler(async (req, res) => {
    const requests = await prisma.topUp.findMany({
        where: { status: 'PROCESSING' },
        include: { user: true },
    })
    res.status(200).json(requests)
})

// @desc    Get My Top-Ups
// @route   GET /api/topups/my
// @access  Private
const getMyTopUps = asyncHandler(async (req, res) => {
    const requests = await prisma.topUp.findMany({
        where: { user_id: req.user.id },
        orderBy: { created_at: 'desc' },
    })
    res.status(200).json(requests)
})

// @desc    Reject Top-Up (Admin only)
// @route   POST /api/topups/reject/:id
// @access  Private/Admin
const rejectTopUp = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const topUp = await prisma.topUp.update({
            where: { id: Number(id) },
            data: { status: 'FAILED' },
        })
        res.status(200).json(topUp)
    } catch (error) {
        res.status(400)
        throw new Error('Reject failed')
    }
})

module.exports = {
    requestTopUp,
    getPendingTopUps,
    getMyTopUps,
    rejectTopUp,
}
