const User = require('../../models/user.model')
const Post = require('../../models/post.model')

const userBookMarks = async (req, res) => {
  try {
    if (req.isGuest) {
      return res
        .status(403)
        .json({
          message: 'Please login with college email to bookmark this post.',
        })
    }
    const postid = req.params.postid
    const userDetails = await User.findOne({ email: req.user.email })
    if (userDetails.bookmarks.includes(postid)) {
      userDetails.bookmarks.pull(postid)
      await userDetails.save()
      res
        .status(200)
        .json({ message: 'Post removed from bookmark', userDetails })
    } else {
      userDetails.bookmarks.push(postid)
      await userDetails.save()
      res.status(200).json({
        message: 'Post bookmarked',
        userDetails,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchBookMarkedUsers = async (req, res) => {
  try {
    const postid = req.params.postid
    const users = await User.find({ bookmarks: { $in: [postid] } })
    const bookMarkedUsers = users.map((user) => user._id)

    res.json({
      bookmarkedUsers: bookMarkedUsers,
    })
  } catch (error) {
    console.log(error)
  }
}

const fetchUserBookmarkedPosts = async (req, res) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })
      .populate('bookmarks')
      .exec()
    res.json(userDetails)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server error' })
  }
}

module.exports = {
  userBookMarks,
  fetchBookMarkedUsers,
  fetchUserBookmarkedPosts,
}
