const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const secretKeyForAuthentication = process.env.JWT_SECRET

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
    secretKeyForAuthentication
  );

  res.status(201).json({
    token: token,
    message: "account created!",
  });
};

module.exports =  register ;
