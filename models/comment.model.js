const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema= new Schema(
    {
        content:{
            type:String,
            required:true
        },
        user_id:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        post_id:{
            type:Schema.Types.ObjectId,
            ref:'Post'
        },
        parentId: {
            type: String, 
            default:null
        }
    },
    {timestamps:true}
)

const Comment=mongoose.model("Comment",commentSchema)
module.exports = Comment;