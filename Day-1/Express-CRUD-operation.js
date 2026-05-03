import express from "express";

const app = express();
app.use(express.json());
const PORT =3000;

let data = [];
// CRUD Operation on express 
// Create Operation  and POST operation 

app.post('/data',(req,res)=>{
    data.push(req.body);
    console.log(req.body);
    res.send("Data is added successfull completed ");
    res.end();
})

// Read operation and GET Operation 

app.get('/data',(req,res)=>{
    res.json(data);
    res.end();
})

// Update operation and PUT operation 
app.put('/data',(req,res)=>{
    data[0] = req.body;
    console.log(req.body);
    res.send("Updated successfully ");
    res.end();
})

// Delete operation and DELETE Operation 
app.delete('/data',(req,res)=>{
    data=[];
    res.send('Deleted');
})
app.listen(PORT,()=>{
    console.log(`Server is running on the ${PORT}`);
})