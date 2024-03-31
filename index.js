const cors=require('cors');
const express=require('express');
const multer = require('multer');
const { redirect } = require("react-router-dom");

const UserController=require('./controller/User.controller')
const RecipeController=require('./controller/Recipe.controller')
const RecipeModel=require('./models/Recipe.model');
const connection = require('./configs/db')

require('dotenv').config()

const app = express();
const session=require('express-session');
const {passport} = require('./utils/google.auth')

app.use(cors());
app.use(express.json());
const path = require('path');

// Define the directory for static files
const uploadsDirectory = path.join(__dirname, 'uploads');

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDirectory));
app.use(session({
  secret:process.env.EncryptionKey,
  resave:false,
  saveUninitialized:true
}))

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, '/src/my-images');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});
const upload = multer({ storage: storage });

// setuppassport
app.use(passport.initialize());
app.use(passport.session());
app.use("/user",UserController)
app.use("/recipe",RecipeController)
app.post('/upload', upload.single('recipeImage'), (req, res) => {
  // Access uploaded file via req.file
  // Process the uploaded file (e.g., save it to the database or perform further validation)
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});
app.get("/", async (req,res)=>{
  const posts = await RecipeModel.find();
  res.status(200).json({endpoints:{
    "user":{
    "/login":"login",
    "/sign":"Sign up",
    "/editProfile/:userId":"Edit User Details",
},
    "recipe":{ "/getRecipe":"To get all recipes",
    "/getRecipe/:recipeId":"Get Recipe With Recipe ID recipeId",
    "/getRecipe/:userId":"Get Recipes Posted By User with User ID userId",
    "/search":"Search recipes With Query",
    "/delete/:id/:userID":"Delete Recipe",
     "/postRecipe":"To Post Recipe",}
  }});
 
})
// app.get('/auth/google/callback', 
//   passport.authenticate('google', {   successRedirect:"http://localhost:3000/",failureRedirect: '/login'},
  
//   function(req, res) {
//     // This code will only execute if authentication succeeds
//     console.log('Successful authentication', req.user);
//     res.json(req.user);
//   }
//   )
//   );
app.get('/auth/google/callback', 
passport.authenticate('google', {
  // successRedirect:"http://localhost:3000/",
  failureRedirect: '/failed',
}),
function (req, res) {
  req.session.user = req.user;
  res.redirect("http://localhost:3000/")

}
);
  app.get("/login/sucess",async(req,res)=>{
    
    if(req.user){
        res.status(200).json({message:"user SignedUp",user:{ id: req.user._id, name: req.user.name, email: req.user.email, profileImg:req.user.profileImg}})
        // // res.redirect(`http://localhost:3000/?id=<${req.user._id}>&name=${req.user.name}&email=${req.user.email}&profileImg=${req.user.profileImg}&token=${req.user.token}`)
        // res.redirect(`http://localhost:3000/?user=${req.user._id}`)
        // req.session.user = req.user; // Assuming req.user contains user details from Google authentication
        // res.redirect('http://localhost:3000/');  
      }else{
        res.status(400).json({message:"Not Authenticated!"})
    }
})



// app.get("/logout",(req,res,next)=>{
//     req.logout(function(err){
//         if(err){
//           return next(err)

//         }
//         res.redirect("http://localhost:3000");
//     })
// })


app.listen(process.env.Port,async()=>{
  try{
     connection;
     console.log("Connection Established With DB");
  }
  catch(e){console.log("Error While Connecting To Database",e);
  }
  console.log('listening on',process.env.Port);  
})