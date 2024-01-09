const express = require('express')
const app = express()
const { databaseConnection } = require('./config/database')
const cors = require('cors')
const postRouter = require('../src/api/routes/post.route')
const userRouter = require('../src/api/routes/user.route')
const commentRouter = require('../src/api/routes/comment.route')
const authRouter = require('./auth/authentication')
const { type } = require('os')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
const { socketController } = require('./api/controllers/users/notification')

require('dotenv').config()

app.use(cors())
app.use(express.json())

// Connecting to mongodb...
databaseConnection(process.env.DB_URL).then(() =>
  console.log('mongodb connected...'),
)

app.use('/', postRouter)
app.use('/', userRouter)
app.use('/', commentRouter)
app.use('/', authRouter)

socketController(io)

server.listen(process.env.PORT, () => {
  console.log('server started on Port ', process.env.PORT)
})
