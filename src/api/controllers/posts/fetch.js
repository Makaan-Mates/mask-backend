const Post = require('../../models/post.model')
const mongoose = require('mongoose')
const trendingAlgorithm = require('../../helpers/trending-algo')
const timeSinceCreated = require('../../helpers/timestamp-algo')
const { calculateTrendingScore } = trendingAlgorithm
const { formatTimeSince } = timeSinceCreated
const ObjectId = mongoose.Types.ObjectId

const fetchPosts = async (req, res) => {
  try {
    const page = parseInt(req.query._page) || 1
    const limit = parseInt(req.query._limit) || 10
    const topicName = req.query.topic
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const trending = req.query.trending
    let posts
    let totalCount

    if (topicName === 'home') {
      posts = await Post.find()
        .populate({
          path: 'user_id',
          select: 'username college profession bio bookmarks -_id',
        })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .exec()

      totalCount = await Post.countDocuments()
    } else {
      posts = await Post.find({
        topic: new RegExp('^' + topicName + '$', 'i'),
      })
        .populate({
          path: 'user_id',
          select: 'username college profession bio  -_id',
        })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .exec()

      totalCount = await Post.countDocuments({
        topic: new RegExp('^' + topicName + '$', 'i'),
      })
    }

    const results = {}

    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      }
    }

    if (posts.length === 0) {
      return res.json({ message: 'No posts found for the specified topic' })
    }

    posts = posts.map((post) => ({
      ...post._doc,
      timeSinceCreated: formatTimeSince(new Date(post.createdAt)),
    }))

    if (trending === 'true') {
      posts.sort((a, b) => {
        const scoreA = calculateTrendingScore(
          a.upvotes.length,
          parseInt(a.totalComments),
          a.createdAt,
        )
        const scoreB = calculateTrendingScore(
          b.upvotes.length,
          parseInt(b.totalComments),
          b.createdAt,
        )
        return scoreB - scoreA
      })
    }

    results.posts = posts
    res.json(results)
  } catch {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
}

const fetchPostDetails = async (req, res) => {
  const postId = req.params.id
  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID format' })
  }

  try {
    const postDetails = await Post.findOne({ _id: postId })
      .populate({
        path: 'user_id',
        select: 'username college profession bio  _id',
      })
      .exec()

    if (!postDetails) {
      res.status(404).json({
        message: 'Post not found!',
      })
    }

    res.json({
      postDetails,
      timeSinceCreated: formatTimeSince(new Date(postDetails.createdAt)),
    })
  } catch (error) {
    console.log(error)
    //res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { fetchPosts, fetchPostDetails }
