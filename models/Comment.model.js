
const mongoose=require('mongoose');
const CommentSchema=mongoose.Schema({
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userbooks" // If you have a User model
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const CommentModel=mongoose.model("Comments",CommentSchema);

module.exports=CommentModel;