import jsonwebtoken from "jsonwebtoken";

const verify = jsonwebtoken.verify;

export const createAccessToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};