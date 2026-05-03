import express from "express";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = 3000;
// app.use(express.static("dist"));
app.get("/",(req,res)=>{
    res.send("Hello world");
})

// set up cloudinary
cloudinary.config({
    
    cloud_name :process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
}) ;

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        // cb(null,file.originalname);
            cb(null, Date.now() + "-" + file.originalname);

    },
});


const upload = multer({storage});


app.post("/upload",upload.single("file"),async(req,res)=>{
    try{
        const file = req.file;
        // const result = await cloudinary.uploader(req.file.path) ;
        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);
        res.status(200).json({
            message:"upload success",
            url:result.secure_url,
        });

    }catch(error){
        fs.unlinkSync(req.file.path);// clean up the upload file on error 
        res.status(500).json({
            message:"upoad failed .",
            error:error.message,
        }); 
    }
})
app.listen(PORT,()=>{
    console.log("Serverces is now started ")
});