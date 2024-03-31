const jwt =require("jsonwebtoken")
const authorization=(req,res,next)=>{
  if(!req.headers.authorization){
    return res.send("Please Login First!");
}
const token = req.headers.authorization.split(" ")[1];
jwt.verify(token,process.env.EncryptionKey,function(err,decoded){
    if(decoded){
      req.body.userId=decoded.userId;
      next();
    }
    else{
        res.json(`Not Authorized Login again! ${req.headers.authorization.split(" ")[1]}`)
        console.log("Error occured while login",err)
    }
})
}

module.exports=authorization;

//auth done sign login
//MAIN FOLDER -->FULLSTACK-->BACKEND--FRONTEND
//WILL BE SHORTLY WORKING ON FRONTEND MORE LIKE DUMMIES