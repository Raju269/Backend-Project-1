import express from 'express';
import multer from 'multer';

const app = express();
app.use(express.json());
const PORT = 3000;
const upload = multer({dest:'uploads/'});
app.post('/profile',upload.single("dp"),(req,res)=>{
    res.status(200).json({message : "Update profile photos "});

})

app.listen(PORT,()=>{
    console.log(`server is start at ${PORT}`)
})