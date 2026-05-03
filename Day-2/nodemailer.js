import express from 'express'
import nodemailer from 'nodemailer';

const PORT = 3000;
const app = express();

app.get("/",(req,res)=>{
    res.send("Hello world");
})

// console.log(nodemailer)

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        // asdfasdf
        // user:"surjeet.engineer234@gmail.com",
        user:"rajuk631149@gmail.com",
        pass: "rffx vwxo gply rkmg",
    },
});

const mailOptions = {
    from :"rajuk631149@gmail.com",
    to:"surjeet.engineer234@gmail.com",
    subject :"Test Email from Node.js",
    text : "This is a test email send from ndoe.js by raju kumar",
};

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Email sent : "+info.response);
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
})