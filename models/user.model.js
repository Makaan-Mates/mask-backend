const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim:true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    topics:[
        {
        type:Schema.Types.ObjectId,
        ref:'Topic'
        }
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    refreshToken:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
