import express from 'express';
import multer from 'multer';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// step 1 is code of multer 
const upload = multer({dest:'uploads/'})

app.post('/profile',upload.single("dp"),(req,res)=>{
    res.status(201).json({message:"profile Uploaded "});

})

app.listen(PORT,()=>{
    console.log(`server is start now ${PORT}`);
})
