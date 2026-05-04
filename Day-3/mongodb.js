import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
// import dns from 'dns';
import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 5000;

app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected successfully"))
.catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// REGISTER API
app.post("/api/v1/auth/register", async (req, res) => {
    try {
        const { username, email } = req.body;
        let password = req.body.password;

        let hashedPassword = await bcrypt.hash(password,10); 

        const user = new User({ username, email, password : hashedPassword });
        const savedUser = await user.save();

        res.status(201).json({
            message: "User created",
            user: savedUser
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET ALL USERS
app.get("/api/v1/auth/users", async (req, res) => {
    try {
        const allUsers = await User.find();

        if (allUsers.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({
            message: "All users",
            users: allUsers
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});