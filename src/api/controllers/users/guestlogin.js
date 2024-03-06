const jwt = require('jsonwebtoken')
require('dotenv').config()

const guestlogin = async (req, res) => {
    const guestEmail = 'guest@example.com'
    const username = 'Guest'
    const guestPassword = 'guest123'
  
    // Assuming you have a method to authenticate users
    //   const token = await authenticateUser(guestEmail, guestPassword)
    const token = jwt.sign(
      { email: guestEmail },
  
      process.env.JWT_SECRET,
    )
    if (token) {
      return res.status(200).json({
        token: token,
        message: 'Guest login successful',
      })
    } else {
      return res.status(401).json({
        message: 'Guest login failed',
      })
    }
  }

  module.exports = guestlogin