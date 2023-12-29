const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema= new Schema (
    {
        likedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:'Comment'
        },
        post:{
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    },
    {timestamps:true}
)

const Like = mongoose.model("Like",likeSchema);
module.exports = Like;