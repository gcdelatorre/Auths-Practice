# MERN JWT Auth: Refresh Token Rotation

# READ MORE IN CHATGPT CONVERSATION TITLE : REFRESH TOKEN ROTATION, MORE SECURE TOKENS UNDERSTANDING

This document explains refresh token rotation in a MERN application using JWT.

---

## 1. Login and Token Creation

* User sends email & password to login endpoint.
* Backend verifies the user and password.
* Backend creates **access** and **refresh tokens** using JWT.
* Tokens are sent to the client:

  * Access token → stored in memory or localStorage
  * Refresh token → stored in httpOnly cookie

---

## 2. Access Token Usage

* Frontend sends requests to protected routes with **Authorization header** containing Bearer token.
* If access token is valid → request succeeds.
* If access token expires → server returns 401 Unauthorized.

---

## 3. Refresh Token Rotation

* Client detects expired access token.
* Client sends POST request to `/refresh_token` (refresh token from cookie).
* Server verifies the refresh token and checks it in the database.
* If valid:

  * Generate **new access token**
  * Generate **new refresh token**
  * Replace old refresh token in DB
  * Send new refresh token in cookie, access token in response
* Old refresh token becomes invalid.

---

## 4. Postman Testing Flow

1. **Register or Login**

   * `POST /register` or `POST /login` with email/password
   * Receive access token (JSON) and refresh token (cookie)
2. **Access Protected Route**

   * `POST /protected` with `Authorization: Bearer <access_token>`
   * Should succeed if access token valid
3. **Expire Access Token**

   * Option 1: Wait for token to expire (short expiry for testing)
   * Option 2: Manually modify/delete token in Postman
   * Call `/protected` → should return 401 Unauthorized
4. **Refresh Access Token**

   * `POST /refresh_token` (cookie contains refresh token)
   * Receive **new access token** + **new refresh token cookie**
5. **Retry Protected Route**

   * Use new access token → `/protected` succeeds
6. **Verify Cookie**

   * Check Postman cookie jar → confirm refresh token has rotated

---

## 5. Common Scenarios

### Scenario 1: User Logs In

* Backend issues new access + refresh tokens
* Tokens saved (access in memory, refresh in cookie)

### Scenario 2: Normal Request

* Access token still valid
* User requests protected routes → success
* No refresh needed

### Scenario 3: Access Token Expires

* Access token invalid
* Protected route returns 401
* Client calls `/refresh_token` → new tokens issued
* Old refresh token invalidated

### Scenario 4: Refresh Token Expires

* Refresh token no longer valid (7 days or manual invalidation)
* Client calls `/refresh_token` → 401 Unauthorized
* User must log in again

---

## 6. Protected Route Usage After Refresh

* Frontend uses the new access token for API calls.
* Protected routes continue to work seamlessly.
* Client never has to re-login until refresh token expires or is invalidated.

---

## 7. Key Notes

* Access token = short-lived, used for authorization on protected routes.
* Refresh token = long-lived, stored securely in HTTP-only cookie.
* Refresh token rotation = issue new refresh token every time access token is refreshed.
* Logout or invalid refresh token clears the cookie and requires re-login.
* Ensures security and seamless user experience in MERN apps.
