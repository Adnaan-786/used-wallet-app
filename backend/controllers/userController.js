const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    name, // We'll map this to uid_username or ignore if schema is strict
    email,
    password,
    phone,
  } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { email } })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user and wallet transactionally
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          phone_number: phone,
          uid_username: name || email.split('@')[0], // Fallback
        }
      })

      const wallet = await prisma.wallet.create({
        data: {
          user_id: user.id,
          balance_total: 0,
          balance_available: 0,
          balance_frozen: 0
        }
      })

      return { user, wallet }
    })

    res.status(201).json({
      id: result.user.id,
      uid_username: result.user.uid_username,
      email: result.user.email,
      isAdmin: result.user.isAdmin,
      wallet: result.wallet,
      token: generateToken(result.user.id),
    })

  } catch (error) {
    console.error(error)
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    login user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true }
  })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user.id,
      uid_username: user.uid_username,
      email: user.email,
      isAdmin: user.isAdmin,
      wallet: user.wallet,
      token: generateToken(user.id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

// @desc    get current user
// @route   GET /api/users/current_user
// @access  Protect
const currentUser = asyncHandler(async (req, res) => {
  // req.user is already populated by authMiddleware (Prisma object)
  res.status(200).json(req.user)
})

// @desc    get all users
// @route   GET /api/users/get_users
// @access  Protect
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    include: { wallet: true }
  })
  res.status(200).json(users)
})

// @desc    verify user (Placeholder)
const verify = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Verify not implemented in SQL schema yet' })
})

// @desc    get uploaded image (Placeholder)
const getImage = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Image not implemented' })
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  register,
  login,
  currentUser,
  getUsers,
  verify,
  getImage,
}
