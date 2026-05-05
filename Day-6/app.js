import express from 'express';
import authController from './controllers/auth.controller.js';
import orderController from './controllers/order.controller.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());
app.use("/api/auth",authController);
app.get("/",(req,res)=>{ 
    res.send("Hello world!");
})

export default app;