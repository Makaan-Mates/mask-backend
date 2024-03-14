const User = require('../../models/user.model')
const verifyUser = async (req, res) => {
  try {
    const codeFromFontend = req.body.verificationCode.toString()
    const userDetails = await User.findOne({ email: req.user.email })

    if (codeFromFontend === userDetails.verificationCode.toString()) {
      userDetails.isVerified = true
      await userDetails.save()
      res.json({
        message: 'user verified',
      })
    } else {
      res.status(403).json({
        message: 'incorrect code',
      })
    }
  } catch (error) {
    res.status(500).send('internal server error : ' + error)
  }
}

// const updateVerificationStatus = async () => {
//   try {
//     await User.updateMany({}, { $set: { isVerified: true } })
//     console.log('All users have been marked as verified.')
//   } catch (error) {
//     console.error('Failed to update users:', error)
//   }
// }

// updateVerificationStatus();

module.exports = verifyUser
