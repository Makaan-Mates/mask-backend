const User = require("../../models/user.model")

const saveTopic = async (req, res) => {
    try {
      const topicsFollowing = req.body.selectedTopics;
      const user = await User.findOne({ email: req.user.email });
      const updatedUser = await User.updateOne(
        { _id: user._id },
        { $set: { topicsFollowing: topicsFollowing } }
      );
  
      if (updatedUser.nModified === 0) {
        return res.status(500).json({ message: "Failed to update user" });
      }
  
      res.json({
        message: "success",
      });
    } catch (error) {
      res.status(500).json({
        message: "internal server error",
      });
    }
  }


module.exports = {saveTopic}