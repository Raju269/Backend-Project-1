import express from 'express';
import fs from 'fs';
import path from 'path';
const app = express();

const PORT = 3000;
app.use(express.json());

// middle ware to check user credentials 

let username = 'Rajukumar'
let password = '12345';

app.use((req,res,next)=>{
    if(req.body.username === username ){
        next();
    }
    else{
        res.status(400).json({message:"Incorrect Username "});
    }
})

app.use((req,res,next)=>{
    if(req.body.password === password){
        next();
    }
    else{
        res.status(404).json({message:"invalid credintials"});
    }
})

app.use((req,res,next)=>{
    // fs.writeFile
    fs.appendFile("./entry.txt",`\n ${req.body.username} loggined at ${Date.now()}`,(err,data)=>{
        if(err)
            res.send(200).json({message:"entry done "});
            next();
    })
    
})

app.get('/',(req,res)=>{
    res.send("hello ji and Hi from Raju kumar ");
})

app.get('/login',(req,res)=>{
    res.status(200).send(req.body.username,
        req.body.password
    );
});

app.post('/register',(req,res,next)=>{
    try{
        // Perform registertation logic here
        // eg validate req.body , save user etc. 
        const {username, password} = req.body;
        if(!username || !password){
            const error = new Error("Username and password are required");
            error.status = 400;
            throw error;
        }
        // simulate success 
        res.status(201).json({message:"user registered ",user:{username}});

    }catch(err){
        next(err);
    }
})

app.listen(PORT,()=>{
    console.log(`Server is start to running now ${PORT}`);
})