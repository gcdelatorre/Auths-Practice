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
import { isAuth } from "../middlewares/isAuth.js";

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
    origin: ["http://localhost:3000", "http://localhost:5173"],
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

// 3 Logout account controller
app.post("/logout", async (req, res) => {
    try {
        // get refresh token from cookies
        const refreshToken = req.cookies.refreshtoken;

        // check if token exists, update and change to null
        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            )
        }

        // clear cookie
        res.clearCookie("refreshtoken", {
            path: "/refresh_token", // this clears the cookie and token in the /refresh_token path when logging out, so it can't be used again and is invalidated for security
            httpOnly: true, // ensures only the browser can handle it, not JS
            secure: process.env.NODE_ENV === "production", // match how cookie was set
            sameSite: "strict" // prevents CSRF (cross-site request forgery) attacks
        });

        // send response
        res.status(200).json({ message: "Logged out successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
})

// 4 Protected route setup 
app.post("/protected", isAuth, async (req, res) => {
    const user = await User.findById(req.user.userId)
    const email = user.email;
    res.status(200).json({ message: `Hello ${email}, this is a protected route`, success: true })
})

// 5 Get new access token with refresh token
app.post("/refresh_token", async (req, res) => {
    // 1️⃣ Get the refresh token from the request cookies
    const token = req.cookies.refreshtoken

    if (!token) return res.status(401).json({ message: "Unauthorized" })

    let decoded = null;

    try {
        // 2️⃣ Verify the refresh token
        decoded = verify(token, process.env.REFRESH_TOKEN_SECRET)

        // 3️⃣ Find the user with this token in the database, check if it exists
        const user = await User.findOne({ _id: decoded.userId, refreshToken: token })
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        // 4️⃣ Create new Rotation tokens
        const newAccessToken = createAccessToken(user._id)
        const newRefreshToken = createRefreshToken(user._id)

        // 5️⃣ Save new refresh token to the database (old one becomes invalid)
        user.refreshToken = newRefreshToken
        await user.save()

        // 6️⃣ Send new tokens
        sendRefreshToken(res, newRefreshToken)
        sendAccessToken(req, res, newAccessToken)
    } catch (err) {
        return res.status(401).json({
            message: err.name === "TokenExpiredError"
                ? "Refresh token expired"
                : "Invalid refresh token"
        });
    }
})



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})