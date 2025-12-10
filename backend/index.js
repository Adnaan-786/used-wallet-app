const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const express = require('express')
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')
const fileUpload = require('express-fileupload')


const http = require('http')
const { Server } = require('socket.io')
const notificationService = require('./services/notificationService')

connectDB()

const app = express()
app.use(cors())
app.options('*', cors())
// Enable CORS
app.use(
  fileUpload({
    useTempFiles: true,
  })
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const PORT = process.env.PORT || 8080

app.use(errorHandler)
app.use('/api/users', require('./routes/userRoutes'))
// app.use('/api/', require('./routes/transactionRoutes'))
app.use('/api/', require('./routes/requestRoutes'))
app.use('/api/', require('./routes/uploadRoutes'))
app.use('/api/', require('./routes/topUpRoutes'))
app.use('/api/', require('./routes/sellRoutes'))
app.use('/api/', require('./routes/withdrawRoutes'))


app.get('/', (req, res) => {
  res.send('api is running...')
})

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now
    methods: ['GET', 'POST']
  }
})

// Initialize Notification Service
notificationService.initSocket(io)

server.listen(PORT, () =>
  console.log(
    `Server Running on Port: http://localhost:${PORT} at ${new Date().toLocaleString(
      'en-US'
    )}`.bgCyan.bold.underline
  )
)
