const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const prisma = new PrismaClient()

const makeAdmin = async () => {
    const email = process.argv[2]

    if (!email) {
        console.error('Please provide an email address')
        process.exit(1)
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { isAdmin: true },
        })

        console.log(`User ${user.email} is now an admin`)
    } catch (error) {
        console.error('Error updating user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

makeAdmin()
