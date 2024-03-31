const {UserModel}=require("./User.model")
const mongoose=require('mongoose');
const RecipeSchema=mongoose.Schema(
    {
    title: String,
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userbooks",
    },
    ingredients: [String],
    url:{type:String,},
    instructions: [String],
    prep_time: Number,
    cook_time: Number,
    total_time: String,
    servings: String,
    comments: [{type:mongoose.Schema.Types.ObjectId,ref:"Comments"}],
    mealType:[String],
    rating:Number,
    difficulty:String,
    cuisine:String,
    caloriesPerServing:Number,
    tags:[String],
    createdAt: {
        type: Date,
        default: Date.now
    }
}
);
const RecipeModel=mongoose.model("RecipeBook",RecipeSchema);

module.exports=RecipeModel;