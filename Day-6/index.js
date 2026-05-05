import app from "./app.js";
import dotenv from "dotenv";
import connectDB from './Config/db.config.js';
dotenv.config();

const PORT = 5000;

connectDB();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}) 