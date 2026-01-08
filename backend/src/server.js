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

