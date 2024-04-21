const Notification = require('../../models/notification.model')
const User = require('../../models/user.model')

let onlineUsers = []

const addUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId })
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username)
}

const socketController = (io) => {
  io.on('connection', (socket) => {
    socket.on('newUser', (senderName) => {
      addUser(senderName, socket.id)
    })

    socket.on(
      'sendNotification',
      async ({
        senderName,
        receiverName,
        postId,
        postTitle,
        notificationAction,
      }) => {

        const receiver = getUser(receiverName)

        const newNotification = new Notification({
          senderName: senderName?.toString(),
          receiverName: receiverName.toString(),
          postId: postId.toString(),
          postTitle: postTitle.toString(),
          notificationAction: notificationAction,
        })
        await newNotification.save()

        if (receiver) {
          io.to(receiver.socketId).emit('getNotification', {
            senderName,
            notificationAction,
          })
        }
      },
    )

    socket.on('disconnect', () => {
      removeUser(socket.id)
    })
  })
}

const fetchUserNotications = async (req, res) => {
  try {
    if (req.isGuest) {
      return res.status(403).json({
        message: 'Please login with college email to get notified.',
      })
    }
    const user = await User.findOne({ email: req.user.email })
    const notifications = await Notification.find({
      receiverName: user.username,
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const clearNotifications = async (req, res) => {
  if (req.isGuest) {
    return res.status(403).json({
      message: 'Please login with college email to get notified.',
    })
  }
  const user = await User.findOne({ email: req.user.email })
  await Notification.deleteMany({ receiverName: user.username })
  res.json({ message: 'Notifications cleared' })
}

module.exports = { socketController, fetchUserNotications, clearNotifications }
