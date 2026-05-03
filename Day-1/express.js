import express from "express";

const app = express();
const PORT = 3000;

app.get('/',(req,res)=>{
    res.send("Hello ji kaise hai sab");
    res.end();
})
app.listen(PORT,()=>{
    console.log(`Server is running your ${PORT}`)
})