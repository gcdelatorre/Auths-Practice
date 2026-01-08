import jsonwebtoken from "jsonwebtoken";

const verify = jsonwebtoken.verify;

export const createAccessToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const sendAccessToken = (req, res, accessToken) => {
    res.status(200).json({
        accessToken,
        email: req.body.email
    });
}

export const sendRefreshToken = (res, refreshToken) => {
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/refresh_token",
    });
}