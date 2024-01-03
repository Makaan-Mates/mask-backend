const User = require("../../models/user.model")

const userInfo = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
  
    res.json(user);
  }

module.exports = {userInfo}