const RecipeModel=require("../models/Recipe.model");
const {Router}=require("express");
const CommentModel=require("../models/Comment.model");
const authorization=require("../middlewares/auth.middleware") 
const mongoose=require('mongoose');

const RecipeController=Router();

RecipeController.post("/postRecipe",authorization,async(req,res)=>{
  const authorId=req.body.userId;
    const {title,ingredients,instructions,comments,prep_time,cook_time,total_time,servings,url,cuisine,rating,difficulty,caloriesPerServing,tags,mealType,}=req.body;
     try{
        const recipe = new RecipeModel({
            title,
            authorId,
            ingredients,
            instructions,
            comments,
            prep_time,
            cook_time,
            total_time,
            servings,
            url,
            cuisine,
            rating,
            difficulty,
            caloriesPerServing,
            tags,
            mealType,
            createdAt:Date.now(),
        })
        await recipe.save();
        res.json({message:"added"});
        }
      
     catch(e){console.log("error",e);
     res.json({message:e});}
 })

 
 RecipeController.get("/getRecipe",async(req,res)=>{
  try{
      let { page = 1, limit = 8,sort,filter } = req.query;
      let sortCriteria={};
      let filterCriteria={};
      if(sort){
       const[field,order]= sort.split(" ")
       sortCriteria[field]=parseInt(order);
       console.log(sortCriteria);
      }
      if(filter){
        const[criteria,value]= filter.split(" ")
        filterCriteria[criteria] = value;
        
      }
       let recipe=[];
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
    //  if(!sortCriteria){
      recipe = await RecipeModel.find(filterCriteria).populate('authorId').skip((pageNumber - 1) * limitNumber)
     .limit(limitNumber).sort(sortCriteria)
  //   console.log("not field");
  // }
  //  else{
  //     recipe = await RecipeModel.find(filterCriteria).populate('authorId').skip((pageNumber - 1) * limitNumber)
  //    .limit(limitNumber).sort(sortCriteria);
  //    console.log("field",recipe.caloriesPerServing);

  //  }
     const total_count=await RecipeModel.find({}).count();
         res.json({recipe,total_count});
     }
 catch(e){console.log("error",e);
  res.json({message:e});}
})
 RecipeController.get("/getRecipe/:id", async (req, res) => {
    try {
      const recipeId = req.params.id;
     console.log(recipeId);
      const recipe= await RecipeModel.findById(recipeId).populate('authorId');
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
     res.status(200).json(recipe);
  }
  catch (error) {
      console.error('Error fetching recipe with comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  RecipeController.get("/getUserRecipe", authorization,async (req, res) => {
    try {
      const userId =req.body.userId;
      const recipe= await RecipeModel.find({ authorId: userId });
      if (!recipe) {
        return res.status(404).json({ message: 'No Shares Yet' });
      }
     res.status(200).json({recipe,total:recipe.length});
  }
  catch (error) {
      console.error('Error fetching recipe with comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  //done
  RecipeController.get("/search", async (req, res) => {
    try {
      const { q } = req.query; // Corrected from const {q} = req.query;
      const recipes = await RecipeModel.find({
        $or: [
          { 
            title: { $regex: q, $options: 'i' } 
          }, // Case-insensitive search by title
          { mealType: { $in: [q]  } }, // Search for exact match in mealType array
          { tags: { $in: [q]   } } // Search for exact match in tags array
        ]
      }).populate('authorId');
      if(recipes.length>0){
        res.json({ recipes ,msg:"Found!"});
      }
      else{
        res.json({ recipes,msg:"Not Found!" });
        }
    } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  //done
  RecipeController.delete('/delete/:id',authorization, async (req, res) => {
    try {
      const { id } = req.params;
      const userID =req.body.userId;
       const recipe = await RecipeModel.findById(id);
      if (!recipe) {

        return res.status(404).json({ message: 'Recipe not found' });
      }
      if (recipe.authorId.toString()!== userID) {

        return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this recipe' ,userID,id});
      }
  
      // If the user is authorized, proceed with deletion
      const deletedRecipe = await RecipeModel.findByIdAndDelete(id);
      if (!deletedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      else{
        res.status(200).json({ message: 'Recipe deleted successfully' });

      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 module.exports=RecipeController;