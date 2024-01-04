const Post = require("../../models/post.model")
const timeSinceCreated = require('../../helpers/timestamp-algo')
const { formatTimeSince } = timeSinceCreated

const searchPosts = async (req, res) => {
    try {
      const searchQuery = new RegExp(`${req.params.searchQuery}`, "i");
      const searchResults = await Post.find({
        $or: [{ title: searchQuery }, { description: searchQuery }],
      })
        .populate("user_id")
        .exec();

      const postsearchResults = searchResults.map((post) => ({
      ...post._doc,
      timeSinceCreated: formatTimeSince(new Date(post.createdAt)),
    }))
  
      res.json({
        message: postsearchResults,
      });
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = {searchPosts} 