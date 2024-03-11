const Comment = require('../../models/comment.model')
const Post = require('../../models/post.model')

const fetchComments = async (req, res) => {
  try {
    const postid = req.query.postid

    const commentsForPost = await Comment.find({ post_id: postid })
      .populate({
        path: 'user_id',
        select: 'username college profession bio  _id',
      })
      .populate('post_id')
      .exec()

    await Post.updateOne(
      { _id: postid },
      { $set: { totalComments: commentsForPost.length } },
    )

    res.json(commentsForPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  fetchComments,
}
