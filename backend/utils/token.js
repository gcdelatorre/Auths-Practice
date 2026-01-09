import jsonwebtoken from "jsonwebtoken";

export const createAccessToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (userId) => {
    return jsonwebtoken.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const sendAccessToken = (req, res, accessToken) => {
    res.status(200).json({
        success: true,
        accessToken,
    });
}

export const sendRefreshToken = (res, refreshToken) => {
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true, // prevents JavaScript access (XSS protection)
        sameSite: "strict", // blocks cross-site requests (CSRF protection)
        secure: process.env.NODE_ENV === "production", // HTTPS-only in production
        path: "/refresh_token", // only sent to the refresh endpoint
    });
};