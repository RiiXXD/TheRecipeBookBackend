const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const passport=require('passport');
const UserModel=require("../models/User.model");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile,cb) {
    try {  const existingUser = await UserModel.findOne({ email: profile._json.email });
    if (existingUser) {
      existingUser.name = profile._json.name;
      existingUser.profileImg = profile._json.picture;
      await existingUser.save();
      const token=jwt.sign({userId:existingUser._id},process.env.EncryptionKey);
      // res.json({msg:"Succesfully login ",token})
      console.log("token",token);
      return cb(null,  { id: existingUser.id, name: existingUser.name, email: existingUser.email, profileImg: existingUser.profileImg ,token:token});

    } 
    else{
      const user=new UserModel({
        name:profile._json.name, 
        email:profile._json.email,
        password:uuidv4(),
        profileImg:profile._json.picture
    })
       await user.save();
       console.log(accessToken);

        return cb(null, { id: user.id, name: user.name, email: user.email, profileImg: user.profileImg ,token:accessToken });

    }}
    catch (error) {
      return cb(error);
    }
   }
  
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await UserModel.findById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports={ passport}