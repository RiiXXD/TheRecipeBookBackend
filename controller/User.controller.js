const {Router}=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const UserModel=require("../models/User.model");
const authorization=require("../middlewares/auth.middleware");
const {passport} = require('../utils/google.auth');
const { redirect } = require("react-router-dom");
const { authenticate } = require("passport");
const multer = require('multer');

require('dotenv').config()
const UserController=Router();
UserController.get("/test",(req,res)=>{
  if(req.session.user) res.json({user:req.session.user})
  else res.json("working")
})

UserController.post("/sign",async(req,res)=>{
   const{name, email, password, profileImg}=req.body;
    try{
      const existingUser=await UserModel.findOne({email});
       if(existingUser){
        res.json("Already an user!")
       }
       else{ console.log(name, email, password, profileImg);
        bcrypt.hash(password, 5, async function(err, hash) {
            if(hash){
                const user=new UserModel({
                name, 
                email,
                password:hash,
                profileImg
            })
            await user.save();
            const token=jwt.sign({userId:user._id},process.env.EncryptionKey);
         
            res.json({msg:"Account Created!",user:{ id:user._id,name, email, profileImg,token}})}
            else if(err){
                res.json("Something went wrong try again!")
                console.log(err);
            }
            else{
                res.json("Invalid Credentials!");
               
            }
            
        });}
       
    }
    catch(e){console.log("error",e);}
})

UserController.post("/login",async (req,res)=>{
   const{ email, password}=req.body;
    // try{
    //     console.log( email, password);
    // }
    const existingUser=await UserModel.findOne({email});
    if(existingUser){
    const cipher=existingUser.password;
    console.log(existingUser);
    bcrypt.compare(password,cipher,(err,result)=>{
      if(err){
        res.json({msg:"Something went wrong try again",error:err});
      }
      else if(result){
        const token=jwt.sign({userId:existingUser._id},process.env.EncryptionKey);
             res.json({msg:"Succesfully login ",token,user:{ email:existingUser._doc.email, name:existingUser._doc.name,id:existingUser._doc._id,profileImg:existingUser._doc.profileImg}})
      }
      else{
        res.json({msg:"Invalid credentials"});
      }
    })}
        
    else{
      res.json({msg:"Login First!"})
    }
            
        
})
UserController.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
  
  );

  UserController.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), function(req, res) {
    const userData = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImg: req.user.profileImg,
        token: req.user.token
    };
    res.json(userData);});
UserController.get("/edit",authorization,async (req,res)=>{
res.json("login aftermath")

})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the directory where uploaded files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name for the uploaded file
  }
});

const upload = multer({ storage: storage });
UserController.put("/editProfile/:userId",upload.single('profileImg'),async(req,res)=>{
try{
  const userId = req.params.userId;
  const { name } = req.body;
  let profileImg = ""; // Initialize profileImg variable

  // Check if a file was uploaded
  if (req.file) {
      profileImg = req.file.filename;
      console.log("checkInside",profileImg,req.file); // Use the filename saved by multer
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
}
if (name) {
  user.name = name;
}
if (profileImg) {
  user.profileImg = profileImg;
}
await user.save();
res.status(200).json({ message: 'User details updated successfully.', user });
}
catch(e){
  console.log('Error updating user details:', e);
  res.status(500).json({ message: 'Internal server error.' });
}
})
UserController.post('/like/:userId/:recipeId', async (req, res) => {
  const { userId, recipeId } = req.params;
  try {
      const user = await UserModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Check if the recipe is already liked
      if (!user.likedRecipes.includes(recipeId)) {
          user.likedRecipes.push(recipeId);
          await user.save();
          res.json({ message: 'Recipe liked successfully' });
      } else {
          res.status(400).json({ message: 'Recipe already liked' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports=UserController;