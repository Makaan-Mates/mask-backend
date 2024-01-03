const Post = require('../../models/post.model')
const timeSinceCreated = require('../../helpers/timestamp-algo')
const { formatTimeSince } = timeSinceCreated

const userPostsInfo = async (req, res) => {
  try {
    const userPosts = await Post.find({ user_id: req.params.userId })
      .populate('user_id')
      .exec()

    const userPostsWithTime = userPosts.map((post) => ({
      ...post._doc,
      timeSinceCreated: formatTimeSince(new Date(post.createdAt)),
    }))

    res.json(userPostsWithTime)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server error' })
  }
}

module.exports = {
  userPostsInfo,
}
