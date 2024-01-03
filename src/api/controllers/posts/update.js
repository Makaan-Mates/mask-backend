const Post = require("../../models/post.model")
const User = require("../../models/user.model")

const editPost = async (req, res) => {
  try {
    const postid = req.params.postid;
    const postDetails = await Post.findOne({ _id: postid });
    const postUserId = postDetails.user_id.toString();

    const userId = await User.findOne({ email: req.user.email });
    const loggedInUserId = userId._id.toString();

    const { newTitle, newDescription, newTopic } = req.body;

    let updatePostDetails;

    if (postUserId === loggedInUserId) {
      updatePostDetails = await Post.findOneAndUpdate(
        {
          _id: postid,
        },
        {
          $set: {
            title: newTitle,
            description: newDescription,
            topic: newTopic,
          },
        },
        {
          new: true,
        }
      );
    }

    if (!updatePostDetails) {
      console.log("Not Updated");
    }

    res.json({
      message: "Post Edited",
      postDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {editPost}