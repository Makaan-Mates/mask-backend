const Comment = require("../../models/comment.model")
const Post = require("../../models/post.model")

const fetchComments = async (req, res) => {
  try {
    const postid = req.query.postid;
    const allComments = await Comment.find()
      .populate("user_id")
      .populate("post_id")
      .exec();

    // Here filtered comments is the total comments of a post
    const filteredComments = allComments.filter(
      (comment) => comment?.post_id?._id.toString() === postid
    );

    // Update the Post document with the filteredComments
    await Post.updateOne(
      { _id: postid },
      { $set: { totalComments: filteredComments.length } }
    );

    res.json(allComments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  fetchComments,
};
