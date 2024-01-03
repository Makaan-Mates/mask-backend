const Post = require("../../models/post.model")

const userPostsInfo = async (req, res) => {
    try {
      const userPosts = await Post.find({ user_id: req.params.userId })
        .populate("user_id")
        .exec();
  
      res.json(userPosts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });
    }
  }

module.exports = {
    userPostsInfo
}