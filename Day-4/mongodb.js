import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import dns from "dns";
import { loginLimiter } from "./ratelimiter.js";
import { type } from "os";
import asyncHandler from "./asyncHandler.js";
dns.setServers(['1.1.1.1','8.8.8.8']);

dotenv.config();
const app = express();
const PORT = 5000;
app.use(express.json());

// MongoDB connect 
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB is connected successfully bro "))
.catch((err)=> console.log(err));

// Schema 
const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required : true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required : true
    },
});

const User = mongoose.model('User',userSchema);

// Register api 

app.post("/api/v1/auth/register", asyncHandler (async(req,res)=>{
    const {username , email } = req.body;
    let password = req.body.password;
    // try{

    //     let hashedPassword = await bcrypt.hash(password,10);

    //     const user = new User({username , email , password : hashedPassword});
    //     const savedUser = await user.save();

    //     res.status(201).json({
    //         message:"User Created",
    //         user : savedUser
    //     });
    // }catch(err){
    //     res.send(400).json({
    //         message:err.message});
    // }

    // alternate method 
    // const user = await  User.findOne({email});
    // if(!user) throw new ApiError(404," ")

}));


// veriication token and middleware 
const verificationToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "access denied because no token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err); 


    
  }
};

// get all users 

app.get("/api/v1/auth/users", verificationToken, async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      res.status(400).json({ message: "no users found" });
    }
    res.status(200).json({ message: "all users", users: allUsers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// login ka liya 
app.post("/api/v1/auth/login",loginLimiter, async (req, res)=>{
    const {email , password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user)
            return res
        .status(400)
        .json({message:"User not exist please register first "});
        
        const isMatched = await bcrypt.compare(password, user.password);
        
        if(!isMatched)
            return res.status(404).json({message:"invalid password"});

        // jwt ka token work 
        // token 
        const token = jwt.sign({id:user._id, email:user.email},
            process.env.SECRET_KEY,
            {expiresIn:"1d"} ,

        );
        if(!token) return res.status(500).json({message:"server error while generating token"});
        
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:1000 * 60 *60 *24,
        });
        if(!res.cookie){
            return
        }
        res.status(200).json({message:"login Successfull token ",token});        
    } catch(err){
        res.status(404).json({err:err.message});
    }
})


app.listen(PORT,()=>{
        console.log(`Server started on port ${PORT}`);

})