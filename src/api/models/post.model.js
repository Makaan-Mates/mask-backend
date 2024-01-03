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

    isPost: {
      type: Boolean,
    },
    upvotes:
     [ {
        type:Schema.Types.ObjectId,
        ref : 'User'
      }],
      
      totalComments : {
        type : Number,
        default: 0
      },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
