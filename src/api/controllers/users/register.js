const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const bcrypt = require('bcrypt')
const z = require('zod')
const sendEmail = require('./sendEmail')
require('dotenv').config()

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body

    const userExists = await User.findOne({ username: username })

    if (userExists) {
      return res.json({
        message: 'username already taken',
      })
    }

    const usernameSchema = z.string().max(8).min(3)

    const emailSchema = z
      .string()
      .email()
      .refine((email) => email.endsWith('.ac.in') || email.endsWith('.edu'), {
        message: 'You must sign up with your college email',
      })

    const passwordSchema = z.string().min(8)

    const usernameValidationResult = usernameSchema.safeParse(username)
    const emailValidationResult = emailSchema.safeParse(email)
    const passwordValidationResult = passwordSchema.safeParse(password)

    if (!usernameValidationResult.success) {
      const message = usernameValidationResult.error.issues[0].message.split(
        'g',
      )[1]
      const finalMessage = 'username' + message
      return res.json({
        message: finalMessage,
      })
    }

    if (!emailValidationResult.success) {
      if (
        emailValidationResult.error.issues &&
        emailValidationResult.error.issues.length > 0
      ) {
        return res.status(403).json({
          message: emailValidationResult.error.issues[0].message,
        })
      } else {
        return res.status(403).json({
          message: 'Invalid email!',
        })
      }
    }

    if (!passwordValidationResult.success) {
      return res.status(403).json({
        message: 'Password must be minimum 8 characters long',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationCode = Math.floor(1000 + Math.random() * 9000)

    const organization = email.split('@')[1].split('.')[0]

    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
      verificationCode: verificationCode,
      college: organization,
    })

    const savedUser = await newUser.save()

    const token = jwt.sign(
      { email: savedUser.email },

      process.env.JWT_SECRET,
    )

    sendEmail(email, verificationCode)

    res.status(201).json({
      token: token,
      message: 'account created!',
    })
  } catch (error) {
    console.log(error?.message || 'Registration unsuccessful')
  }
}

module.exports = register
