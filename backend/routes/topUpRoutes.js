const express = require('express')
const router = express.Router()
const {
    requestTopUp,
    rejectTopUp,
    getPendingTopUps,
    getMyTopUps,
} = require('../controllers/topUpController')
const { approveTopUp } = require('../controllers/transactionController')
const { protect, admin } = require('../middleware/authMiddleware')

// Matches /api/topups (mounted at /api/)
router.post('/topup/submit', protect, requestTopUp)
router.get('/topups/my', protect, getMyTopUps) // For TransactionHistory
router.get('/topups/pending', protect, admin, getPendingTopUps)
router.post('/topups/approve', protect, admin, approveTopUp) // Changed to match transactionController signature if needed, or keep param
// transactionController.approveTopUp expects body { adminId, topUpId }
// So route should be POST /topups/approve

router.post('/topups/reject/:id', protect, admin, rejectTopUp)

module.exports = router
