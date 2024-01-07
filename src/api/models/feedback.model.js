const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema= new Schema(
    {
        feedback:{
            type:String,
            required:true
        },
        user_id:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {timestamps:true}
)

const Feedback=mongoose.model("Feedback",feedbackSchema)
module.exports = Feedback;