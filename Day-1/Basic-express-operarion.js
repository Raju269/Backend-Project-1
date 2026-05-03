import express from "express";
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { url } from "inspector";

const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/contact',(req,res)=>{
    fs.readFile("./views/home.ejs","utf-8",(err,data)=>{
        if(err)
            res.status(404).json({err:err.message});
        res.status(200).send(data);
    })
})

app.post('/login',(req,res)=>{
    console.log(req.body);
    res.status(200).json({message:"Your are successful login now "});
})


app.get("/product",(req,res)=>{
    fs.readFile('./product.json','utf-8',(err,data)=>{
        if(err)
            res.status(404).json({message:"Page not founded"});
        res.status(200).json(data);
    })
})

app.listen(PORT,()=>{
    console.log(`Server is stated to running at ${PORT}`)
})