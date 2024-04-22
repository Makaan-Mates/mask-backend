const Post = require('../../models/post.model')
const User = require('../../models/user.model') // Import the User model
const timeSinceCreated = require('../../helpers/timestamp-algo')
const { formatTimeSince } = timeSinceCreated

const searchPosts = async (req, res) => {
  try {
    const searchQuery = new RegExp(`${req.params.searchQuery}`, 'i')

    // Using aggregation to optimize the search
    const searchResults = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $match: {
          $or: [
            { title: searchQuery },
            { description: searchQuery },
            { 'userDetails.college': searchQuery },
          ],
        },
      },
      {
        $unwind: '$userDetails', // Deconstructs the userDetails array
      },
      {
        $project: {
          title: 1,
          description: 1,
          createdAt: 1,
          'userDetails.username': 1,
          'userDetails.college': 1,
          'userDetails.profession': 1,
          'userDetails.bio': 1,
          totalUpvotes: { $size: '$upvotes' },
        },
      },
    ])

    // Format the search results to include time since created
    const formattedResults = searchResults.map((post) => ({
      ...post,
      timeSinceCreated: formatTimeSince(new Date(post.createdAt)),
    }))

    res.json({
      message: formattedResults,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Server error')
  }
}

module.exports = { searchPosts }
