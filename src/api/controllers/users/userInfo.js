const User = require('../../models/user.model')

const userInfo = async (req, res) => {
  if (req.isGuest) {
    return res.status(403).json({
      message: 'Please login with college email for user.',
    })
  }
  const user = await User.findOne(
    { email: req.user.email },
    '-password -verificationCode',
  )

  res.json(user)
}

module.exports = { userInfo }
