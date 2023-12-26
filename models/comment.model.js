const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema= new Schema(
    {
        content:{
            type:String,
            required:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        post:{
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    },
    {timestamps:true}
)

export const Comment=mongoose.model("Comment",commentSchema)