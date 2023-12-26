const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchena = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner:{
       type:Schema.Types.ObjectId,
       ref:'User'
    },
    topic:{
        type:Schema.Types.ObjectId,
        ref:'Topic'
    },
    createdAt: {
      type: Date,
      required: true,
    },
    isPost: {
      type: Boolean,
    }
  },
  {timestamps:true}
);

export const Post=mongoose.model("Post",postSchena)
