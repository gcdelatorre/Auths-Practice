# MERN JWT Auth: Protected Routes & User-Specific Data

This document explains JWT authentication in a MERN application, focusing on protected routes and fetching user-specific data.

---

## 1. Login and Token Creation

* User sends email & password to login endpoint.
* Backend verifies the user and password.
* Backend creates **access** and **refresh tokens** using JWT.
* Tokens are sent to the client:

  * Access token → stored in memory or localStorage
  * Refresh token → stored in httpOnly cookie

---

## 2. Accessing Protected Routes

* Frontend sends a request with an **Authorization header** containing the Bearer token.
* Middleware `isAuth`:

  * Checks for a valid Bearer token.
  * Verifies the token with the server secret.
  * Adds a `req.user` object containing the userId.
* `req.user` is **not present by default**; it is added by the middleware.
* Controllers will now use `req.user.userId` to identify the current user to fetch for.

---

## 3. Controller Fetching User-Specific Data

* Controllers query the database using `req.user.userId`.
* This ensures each user only sees their own data.
* Never trust userId from client input.

---

## 4. Flow Summary

1. User logs in → server signs token with user._id
2. Client stores token → sends it on each request
3. Request hits protected route → `isAuth` middleware verifies token
4. Middleware sets `req.user.userId`
5. Controller queries DB using `req.user.userId`
6. Server returns only the logged-in user’s data

---

## 5. Key Notes

* Access token = short-lived identity token
* Refresh token = used to generate new access tokens
* Middleware injects `req.user` → controllers use it for user-specific operations
* `req.user` can store more info (role, email) for scalability
* Ensures secure, user-specific access in a MERN application
