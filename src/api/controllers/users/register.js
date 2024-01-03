const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
require('dotenv').config()

const register = async (req, res) => {
  const { email, password, username } = req.body;

  const newUser = new User({
    email,
    username,
    password,
  });

  const savedUser = await newUser.save();

  const token = jwt.sign(
    { email: savedUser.email },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    token: token,
    message: "account created!",
  });
};

module.exports =  register ;
