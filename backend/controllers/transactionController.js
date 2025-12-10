const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { emitBalanceUpdate, sendPushNotification } = require('../services/notificationService')

// 1. Approve TopUp
const approveTopUp = async (req, res) => {
  const { adminId, topUpId } = req.body

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Get the TopUp record
      const topUp = await prisma.topUp.findUnique({
        where: { id: topUpId },
      })

      if (!topUp) {
        throw new Error('TopUp not found')
      }

      if (topUp.status !== 'PROCESSING') {
        throw new Error('TopUp is not in processing state')
      }

      // 2. Update TopUp status to COMPLETED
      const updatedTopUp = await prisma.topUp.update({
        where: { id: Number(topUpId) },
        data: { status: 'COMPLETED' },
      })

      // 3. Update Wallet: Increment balance_total AND balance_available
      const updatedWallet = await prisma.wallet.update({
        where: { user_id: topUp.user_id },
        data: {
          balance_total: { increment: topUp.amount },
          balance_available: { increment: topUp.amount },
        },
      })

      return { updatedTopUp, updatedWallet }
    })

    // Notifications
    emitBalanceUpdate(result.updatedTopUp.user_id, result.updatedWallet.balance_available)
    // Assuming we fetch user's FCM token somewhere, for now just a placeholder call
    // sendPushNotification(userFcmToken, 'TopUp Approved', `Your topup of ${result.updatedTopUp.amount} is approved.`)

    res.status(200).json({ success: true, data: result.updatedTopUp })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

// 2. Create Withdrawal Request
const createWithdrawalRequest = async (req, res) => {
  const { userId, amount, address } = req.body
  const withdrawalAmount = Number(amount)

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Get User's Wallet
      const wallet = await prisma.wallet.findUnique({
        where: { user_id: Number(userId) },
      })

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      // 2. Check Sufficient Funds
      if (Number(wallet.balance_available) < withdrawalAmount) {
        throw new Error('Insufficient available balance')
      }

      // 3. Atomic Update: Deduct from available, Add to frozen
      await prisma.wallet.update({
        where: { user_id: Number(userId) },
        data: {
          balance_available: { decrement: withdrawalAmount },
          balance_frozen: { increment: withdrawalAmount },
        },
      })

      // 4. Create Withdrawal Record
      const withdrawal = await prisma.withdrawal.create({
        data: {
          user_id: Number(userId),
          amount: withdrawalAmount,
          wallet_address: address,
          order_no: `WTH-${Date.now()}`, // Simple order no generation
          status: 'PROCESSING',
        },
      })

      return withdrawal
    })

    res.status(201).json({ success: true, data: result })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

// 3. Process Withdrawal (Approve/Reject)
const processWithdrawal = async (req, res) => {
  const { adminId, withdrawalId, action } = req.body // action: 'APPROVE' | 'REJECT'

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Get Withdrawal Record
      const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: Number(withdrawalId) },
      })

      if (!withdrawal) {
        throw new Error('Withdrawal request not found')
      }

      if (withdrawal.status !== 'PROCESSING') {
        throw new Error('Withdrawal is already processed')
      }

      const amount = Number(withdrawal.amount)
      let updatedWallet

      if (action === 'APPROVE') {
        // 2a. Update Status to COMPLETED
        const updatedWithdrawal = await prisma.withdrawal.update({
          where: { id: Number(withdrawalId) },
          data: { status: 'COMPLETED' },
        })

        // 3a. Atomic Update: Deduct from frozen AND total (Money leaves system)
        updatedWallet = await prisma.wallet.update({
          where: { user_id: withdrawal.user_id },
          data: {
            balance_frozen: { decrement: amount },
            balance_total: { decrement: amount },
          },
        })

        return { updatedWithdrawal, updatedWallet, action: 'APPROVE' }

      } else if (action === 'REJECT') {
        // 2b. Update Status to FAILED
        const updatedWithdrawal = await prisma.withdrawal.update({
          where: { id: Number(withdrawalId) },
          data: { status: 'FAILED' },
        })

        // 3b. Atomic Update: Deduct from frozen AND Return to available (Refund)
        updatedWallet = await prisma.wallet.update({
          where: { user_id: withdrawal.user_id },
          data: {
            balance_frozen: { decrement: amount },
            balance_available: { increment: amount },
          },
        })

        return { updatedWithdrawal, updatedWallet, action: 'REJECT' }
      } else {
        throw new Error('Invalid action')
      }
    })

    // Notifications
    emitBalanceUpdate(result.updatedWithdrawal.user_id, result.updatedWallet.balance_available)

    if (result.action === 'APPROVE') {
      // sendPushNotification(userFcmToken, 'Withdrawal Approved', ...)
    } else {
      // sendPushNotification(userFcmToken, 'Withdrawal Rejected', ...)
    }

    res.status(200).json({ success: true, data: result.updatedWithdrawal })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = {
  approveTopUp,
  createWithdrawalRequest,
  processWithdrawal,
}
