const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topic: {
      type: String,
    },
    createdAt: {
      type: Date,
    },

    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
