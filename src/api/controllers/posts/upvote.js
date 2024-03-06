const Post = require('../../models/post.model')
const User = require('../../models/user.model')

const saveUpvotes = async (req, res) => {
  try {
    if (req.isGuest) {
      return res
        .status(403)
        .json({ message: 'Please login with college email to upvote.' })
    }
    const postid = req.params.postid
    const postDetails = await Post.findOne({ _id: postid })
    const userDetails = await User.findOne({ email: req.user.email })
    const userId = userDetails._id.toString()

    if (postDetails.upvotes.includes(userId)) {
      const index = postDetails.upvotes.indexOf(userId)
      postDetails.upvotes.splice(index, 1)
      await postDetails.save()
      res.status(200).json({ message: 'Upvote Removed', postDetails })
    } else {
      postDetails.upvotes.push(userId)
      await postDetails.save()
      res.json({
        message: 'Upvoted',
        postDetails,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}

const fetchUpvotes = async (req, res) => {
  try {
    const postid = req.params.postid
    const postDetails = await Post.findOne({ _id: postid })
    res.json({
      upvotes: postDetails.upvotes,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { saveUpvotes, fetchUpvotes }
