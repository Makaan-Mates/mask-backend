const Comment = require('../../models/comment.model')
const User = require('../../models/user.model')

const publishComment = async (req, res) => {
  try {
    if (req.isGuest) {
      return res
        .status(403)
        .json({ message: 'Please login with college email to comment on this post.' })
    }
    const commentBody = req.body.content
    const postid = req.body.postid
    const email = req.user.email
    const isReplySection = req.query.isReplySection
    const parentId = req.body.commentId
    const user = await User.findOne({ email: email })

    const newComment = await Comment({
      content: commentBody,
      user_id: user._id,
      post_id: postid,
    })

    const savedComment = await newComment.save()

    if (isReplySection === 'true') {
      const updatedComment = await Comment.updateOne(
        { _id: savedComment._id },
        { $set: { parentId: parentId } },
      )

      if (updatedComment.nModified === 0) {
        return res.status(500).json({ message: 'Failed to update parentId' })
      }
    }

    res.json({
      message: savedComment,
    })
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

module.exports = {
  publishComment,
}
