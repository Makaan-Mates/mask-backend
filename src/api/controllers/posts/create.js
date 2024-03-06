const Post = require('../../models/post.model')
const User = require('../../models/user.model')

const publishPosts = async (req, res) => {
  if (req.isGuest) {
    return res.status(403).json({ message: 'Please login with college email to post on mask.' })
  }
  const user = await User.findOne({ email: req.user.email })
  const { topic, title, description } = req.body
  const newPost = await Post({
    topic: topic,
    title: title,
    description: description,
    user_id: user._id,
  })

  const savedPost = await newPost.save()
  res.json({
    message: savedPost,
  })
}

module.exports = { publishPosts }
