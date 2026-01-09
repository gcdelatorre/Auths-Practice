import jsonwebtoken from "jsonwebtoken";

// Extract the verify function from jsonwebtoken
const verify = jsonwebtoken.verify;

/**
 * Middleware to protect routes and ensure the user is authenticated
 *
 * This middleware will:
 * 1️⃣ Check for a valid Bearer token in the request headers
 * 2️⃣ Verify the token using the server's secret
 * 3️⃣ Attach the decoded user info (userId) to req.user
 * 
 * Note:
 * - req.user does NOT exist by default in Express.
 * - This middleware is responsible for adding it.
 * - Controllers and downstream middleware can now use req.user
 *   to identify the currently logged-in user, fetch their specific data,
 *   and enforce access control (e.g., only allow users to see their own expenses).
 */
export const isAuth = (req, res, next) => {
    // 1️⃣ Get the Authorization header from the request
    // Usually looks like: "Bearer <token>"
    const authHeader = req.headers["authorization"];

    // 2️⃣ If no header or header is not in Bearer format, deny access
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // 3️⃣ Extract the token part (remove the "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    try {
        // 4️⃣ Verify the token using the server's secret
        // Throws an error if invalid or expired
        const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 5️⃣ Attach the decoded user info to the request object
        // This is crucial because:
        // - The token only identifies the user (userId)
        // - req.user will now be available for controllers to know
        //   which user is making this request
        // Example usage in a controller:
        //   const myExpenses = await Expense.find({ user: req.user.userId });
        req.user = { userId: decoded.userId };

        // 6️⃣ Call next() to continue to the next middleware or controller
        next();
    } catch (err) {
        // 7️⃣ If token verification fails, respond with 401 Unauthorized
        res.status(401).json({ message: "Invalid token" });
    }
};
