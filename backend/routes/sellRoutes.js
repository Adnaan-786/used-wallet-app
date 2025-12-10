const express = require('express')
const router = express.Router()
const {
    requestSell,
    adminActionSell,
    getPendingSells,
} = require('../controllers/sellController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/sell/request', protect, requestSell)
router.get('/sell/pending', protect, admin, getPendingSells)
router.post('/sell/action/:id', protect, admin, adminActionSell)

module.exports = router
