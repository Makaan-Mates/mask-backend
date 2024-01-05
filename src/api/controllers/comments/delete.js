const User = require("../../models/user.model")
const Comment = require("../../models/comment.model")

const deleteComment = async (req, res) => {
  try {
    const commentid = req.params.commentid;
    const userDetails = await User.findOne({ email: req.user.email });
    const commentDetails = await Comment.findOne({ _id: commentid });

    if (!userDetails || !commentDetails) {
      return res.status(404).json({
        message: "User or comment not found",
      });
    }

    if (commentDetails.user_id.toString() === userDetails._id.toString()) {
      await Comment.deleteOne({ _id: commentid });
    }

    res.json({
      message: "comment deleted!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = deleteComment;
