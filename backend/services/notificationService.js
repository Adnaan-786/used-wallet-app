const admin = require('firebase-admin')

// Initialize Firebase Admin
const serviceAccount = require('../config/serviceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

let io

const initSocket = (socketIoInstance) => {
    io = socketIoInstance

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id)

        // Join user-specific room
        socket.on('join_room', (userId) => {
            const roomName = `user_${userId}`
            socket.join(roomName)
            console.log(`Socket ${socket.id} joined room ${roomName}`)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })
}

// Helper: Emit Balance Update via Socket.io
const emitBalanceUpdate = (userId, newBalance) => {
    if (!io) return

    const roomName = `user_${userId}`
    io.to(roomName).emit('BALANCE_UPDATE', {
        type: 'BALANCE_UPDATE',
        balance_available: newBalance
    })
    console.log(`Emitted BALANCE_UPDATE to ${roomName}: ${newBalance}`)
}

// Helper: Send Push Notification via FCM
const sendPushNotification = async (fcmToken, title, body) => {
    if (!fcmToken) return

    const message = {
        notification: {
            title,
            body
        },
        token: fcmToken
    }

    try {
        const response = await admin.messaging().send(message)
        console.log('Successfully sent message:', response)
        // console.log(`[MOCK FCM] Sent to ${fcmToken}: ${title} - ${body}`)
    } catch (error) {
        console.log('Error sending message:', error)
    }
}

module.exports = {
    initSocket,
    emitBalanceUpdate,
    sendPushNotification
}
