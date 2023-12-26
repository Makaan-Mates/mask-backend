const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user_id:{
       type:Schema.Types.ObjectId,
       ref:'User'
    },
    topic:{
        type:String,
        required:true
    },
    createdAt: {
      type: Date,
    },
    isPost: {
      type: Boolean,
    }
  },
  {timestamps:true}
);

const Post=mongoose.model("Post",postSchema)
module.exports = Post;