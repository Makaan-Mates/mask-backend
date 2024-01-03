const jwt = require("jsonwebtoken");
const User = require("../../models/user.model")
require('dotenv').config()

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "account not found" });
    return;
  }

  if (user.password === password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.status(200).json({
      token: token,
      message: "logged in",
    });
  } else {
    res.status(401).json({ message: "wrong password bro" });
  }
};

module.exports = login ;
