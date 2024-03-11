const Post = require('../../models/post.model')
const User = require('../../models/user.model')
const timeSinceCreated = require('../../helpers/timestamp-algo')
const mongoose = require('mongoose')
const z = require('zod')
const { formatTimeSince } = timeSinceCreated

const userPostsInfo = async (req, res) => {
  try {
    const userPosts = await Post.find({ user_id: req.params.userId })
    .populate({
      path: 'user_id',
      select: 'username college profession bio bookmarks _id',
    })
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

const editProfile = async (req, res) => {
  try {
    if (req.isGuest) {
      return res
        .status(403)
        .json({
          message: 'Please login with college email to view your profile.',
        })
    }
    const userId = req.params.userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { newUsername } = req.body

    const usernameSchema = z.string().max(8).min(3)
    const usernameValidationResult = usernameSchema.safeParse(newUsername)
    if (!usernameValidationResult.success) {
      const message = usernameValidationResult.error.issues[0].message.split(
        'g',
      )[1]
      return res.json({ message: 'username ' + message })
    }

    const existingUsername = await User.findOne({ username: newUsername })
    if (existingUsername) {
      return res.json({ message: 'username already taken' })
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { username: newUsername } },
      { new: true },
    )

    res.status(200).json({ message: 'Profile Updated', updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = {
  userPostsInfo,
  editProfile,
}
