import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

import User from "../models/user.model.js";

connectDB();

const verify = jsonwebtoken.verify;
const { hash, compare } = bcrypt;
const app = express();

// GOALS
// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

// Use express middleware for easier cookie handling
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Use express middleware to parse json bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})

// Register account controller
app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await hash(password, 10)

        const newUser = await User.create({
            email,
            password: hashedPassword,
        })

        res.status(200).json({ message: "User created successfully", data: newUser, success: true });

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
})