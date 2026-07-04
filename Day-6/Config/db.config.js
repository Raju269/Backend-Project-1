import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import dns from "dns";

dotenv.config();
// thisi is important for connect to internet if ip address phasing problem issue 
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => { 
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB is connected successfull now ");
    }catch(error){
        console.log(`Error connecting to MongoDB: `,error);
        process.exit(1);
    }
};
export default connectDB;