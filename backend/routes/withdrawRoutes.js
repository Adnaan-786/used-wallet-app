const express = require('express')
const router = express.Router()
const {
    requestWithdraw,
    adminActionWithdraw,
    getPendingWithdraws,
    getMyWithdrawals,
} = require('../controllers/withdrawController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/withdraw/request', protect, requestWithdraw)
router.get('/withdraw/pending', protect, admin, getPendingWithdraws)
router.get('/withdrawals/my', protect, getMyWithdrawals)
router.post('/withdraw/action/:id', protect, admin, adminActionWithdraw)

module.exports = router
