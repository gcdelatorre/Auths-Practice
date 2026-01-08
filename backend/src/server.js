import dotenv from "dotenv";
dotenv.config();

// library imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

// config imports
import connectDB from "../config/db.js";

// db imports
import User from "../models/user.model.js";

// utils imports
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } from "../utils/token.js";

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

// 1 Register account controller
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // crpyt password
        const hashedPassword = await hash(password, 10)

        // create user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        })

        // send response
        res.status(200).json({ message: "User created successfully", data: newUser, success: true });

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
})

// 2 Login account controller

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        // check if valid password
        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        // create access and refresh token
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        // update refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        sendRefreshToken(res, refreshToken);
        sendAccessToken(req, res, accessToken);

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
})



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})