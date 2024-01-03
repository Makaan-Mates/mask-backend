const Post = require("../../models/post.model")
const User = require("../../models/user.model")

const deletePost = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      const postid = req.params.postid;
      const postDetails = await Post.findOne({ _id: postid });
  
      // Delete only if the user is the author of the post
      if (postDetails.user_id.toString() === user._id.toString()) {
        const condition = { _id: postid };
        await Post.deleteOne(condition);
      }
  
      res.json({
        message: "Post Deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = {deletePost}