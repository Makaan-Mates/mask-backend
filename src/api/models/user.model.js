const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
    location: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    topicsFollowing: [
      {
        name: String,
        id: String,
      },
    ],
    
     bookmarks : [{
      type : Schema.Types.ObjectId,
      ref:'Post'
    }]
    
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {    //Middleware hook
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);
module.exports = User;
