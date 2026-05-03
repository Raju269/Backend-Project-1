import express from "express";
import fs from 'fs';
import path  from "path";
const app = express();
const PORT = 3000;

app.use(express.json());



// now we can default value check conditions 
// step 3 
let username = "Raju";
let password = "12345";

// step 5 to reduce the cost of server like frontend and backend we can both add in one single file using dist file ko now how can be exted first cut dist file and pase in public then call the value using of middleware 

// this is step 6 
// app.use(express.static('public'));

// const staticDir = path.join(process.cwd(), "public", "dist");
// app.use(express.static(staticDir));


// step 4 to check the condition is corrected or not 
app.use((req,res,next)=>{
    if(req.body.username === username){
        next();
    }else{
        res.status(400).json({message:"Incorrecct username "})
    }
});

// step 5 to check the password 
app.use((req,res,next)=>{
    if(req.body.password === password){
        next();
    }else{
        res.status(404).json({
            message:"invalid credintals "
        })
    }
});



// to check middleware to check credentials 


// step 2 check if middleware is run proper way


app.use((req,res,next)=>{
    console.log(`middle ware is running phase `);
    next();

});

// maintance a logge to check out user loggined and logout 
app.use((req,res,next)=>{
    fs.appendFile(
        "./entry.txt",
        `\n ${req.body.username} and + ${req.body.password} logged in at ${Date.now()}`,
        (err,data)=>{
            if(err)res.status(400).json({err:err.message});
            res.status(200).json({message:"Entry is done "})
            next();
        },
    )
})


// this is not important 
// app.use((req,res,next)=>{
//     console.log(`Check 2nd time to exceuted middleware `);
//     next();
// })
app.get('/',(req,res)=>{
    res.send("Hi form server ");
})
//  step 1 
// phale hum post required kar ka gha ok 
app.post ('/login',(req,res)=>{
      res.status(200).send(`Welcome to home screen `+req.body.username + `  your password is `+ req.body.password
    );
})

// app.post('/register',(req,res,next)=>{
//     try{
//         // Perform registertation logic here
//         // eg validate req.body , save user etc. 
//         const {username, password} = req.body;
//         if(!username || !password){
//             const error = new Error("Username and password are required");
//             error.status = 400;
//             throw error;
//         }
//         // simulate success 
//         res.status(201).json({message:"user registered ",user:{username}});

//     }catch(err){
//         next(err);
//     }
// })


app.listen(PORT,()=>{
    console.log(`server is started now at ${PORT}`);
})