import express from "express";
import multer from "multer";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// const upload = multer({dest:'uploads/'});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.round()*1e9);
        cb(null, file.fieldname + "-" +file.originalname);
    }
})

const upload =multer ({storage:storage});

app.post('/profile',upload.single('dp'),(req,res)=>{
    res.status(200).json({message:'profile is uploaded now '});
})   

app.listen(PORT,()=>{

        console.log(`server is start now ${PORT}`);

})