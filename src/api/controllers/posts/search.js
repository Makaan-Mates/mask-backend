const Post = require("../../models/post.model")

const searchPosts = async (req, res) => {
    try {
      const searchQuery = new RegExp(`${req.params.searchQuery}`, "i");
      const searchResults = await Post.find({
        $or: [{ title: searchQuery }, { description: searchQuery }],
      })
        .populate("user_id")
        .exec();
  
      res.json({
        message: searchResults,
      });
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = {searchPosts} 