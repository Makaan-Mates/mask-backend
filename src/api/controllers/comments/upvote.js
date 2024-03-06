const Comment = require('../../models/comment.model')
const User = require('../../models/user.model')

const saveCommentUpvotes = async (req, res) => {
  try {
    if (req.isGuest) {
      return res
        .status(403)
        .json({
          message: 'Please login with college email to upvote.',
        })
    }
    const commentid = req.params.commentid
    const commentDetails = await Comment.findOne({ _id: commentid })
    const userDetails = await User.findOne({ email: req.user.email })
    const userId = userDetails._id.toString()

    if (commentDetails.upvotes.includes(userId)) {
      const index = commentDetails.upvotes.indexOf(userId)
      commentDetails.upvotes.splice(index, 1)
      await commentDetails.save()
      res.status(200).json({ message: 'Upvote Removed', commentDetails })
    } else {
      commentDetails.upvotes.push(userId)
      await commentDetails.save()
      res.json({
        message: 'Comment Upvoted',
        commentDetails,
      })
    }
  } catch (error) {
    console.log('Error details:', error)
    res.json({
      message: 'server error',
    })
  }
}

const fetchCommentUpvotes = async (req, res) => {
  try {
    const commentid = req.params.commentid
    const commentDetails = await Comment.findOne({ _id: commentid })
    res.json({
      upvotes: commentDetails.upvotes,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { saveCommentUpvotes, fetchCommentUpvotes }
