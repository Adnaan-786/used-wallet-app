const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const prisma = new PrismaClient()

const listUsers = async () => {
    try {
        const users = await prisma.user.findMany()
        console.log('Users:', users)
    } catch (error) {
        console.error('Error listing users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

listUsers()
