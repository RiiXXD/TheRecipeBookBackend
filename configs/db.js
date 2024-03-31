const mongoose = require('mongoose');
const CommentModel=require('../models/Comment.model')
const RecipeModel=require('../models/Recipe.model') 
const UserModel=require('../models/User.model')
require('dotenv').config();
const connection=mongoose.connect(`${process.env.MONGO_URL}RecipeDb`);

module.exports=connection;