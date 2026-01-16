# Authentication Flow and Best Practices

This document explains the authentication flow implemented in this React application. It follows modern best practices using JWT (JSON Web Tokens) for the API and React Context for state management on the frontend.

## Key Concepts

### 1. JWT (JSON Web Token)

-   **What it is:** A compact, URL-safe means of representing claims to be transferred between two parties. In our case, the backend (server) creates a JWT to claim that the user is authenticated.
-   **How it works:**
    1.  A user logs in with their credentials.
    2.  The server verifies the credentials.
    3.  If valid, the server generates two tokens: an **Access Token** and a **Refresh Token**.
    4.  The **Access Token** is short-lived (e.g., 15 minutes) and is sent with every request to access protected resources.
    5.  The **Refresh Token** is long-lived (e.g., 7 days) and is used to get a new access token when the old one expires.
-   **Security:** Our backend stores the refresh token in an `HttpOnly` cookie. This is a crucial security measure that prevents JavaScript running on the client from accessing it, thus mitigating XSS (Cross-Site Scripting) attacks.

### 2. React Context API

-   **What it is:** A way to manage state globally in a React application. It allows you to share state between components without having to pass props down manually at every level (prop drilling).
-   **How we use it:**
    -   We created an `AuthContext`.
    -   An `AuthProvider` component wraps our entire application. This provider holds the authentication state (`isAuthenticated`) and functions (`login`, `logout`).
    -   Any component that needs to know if the user is logged in or needs to trigger a login/logout action can use our custom `useAuth()` hook.

## The Implementation Flow

Here's a breakdown of the files and how they work together.

### `frontend/src/context/AuthContext.jsx`

-   This is the heart of our frontend authentication state.
-   `createContext()`: Creates the context object.
-   `AuthProvider`: A component that:
    -   Holds the `isAuthenticated` state.
    -   Provides `login` and `logout` functions to modify that state.
    -   On initial load (`useEffect`), it calls a protected endpoint (`/protected`) on our API. If this call succeeds, it means the user has a valid session (via the `HttpOnly` refresh token cookie), and we set `isAuthenticated` to `true`. This keeps the user logged in even if they refresh the page.
-   `useAuth()`: A custom hook that makes it easy and clean for components to get the auth state and functions.

### `frontend/src/main.jsx`

-   Here, we wrap our entire `<App />` component with the `<AuthProvider />`. This ensures that every component in our app has access to the authentication context.

### `frontend/src/pages/Login.jsx`

-   A user enters their credentials.
-   On submit, it calls the `/login` endpoint on our API.
-   If the API returns a success response:
    1.  It calls the `login()` function from our `AuthContext`. This sets the global `isAuthenticated` state to `true`.
    2.  It uses the `useNavigate` hook from `react-router-dom` to redirect the user to a protected page like `/protected`.

### `frontend/src/pages/Register.jsx`

-   A user creates a new account.
-   On successful registration, it redirects the user to the `/login` page so they can sign in.

### `frontend/src/pages/Logout.jsx`

-   This component doesn't render any UI. Its only job is to handle the logout process.
-   It's triggered when a user clicks the "Logout" link.
-   It calls the `/logout` endpoint on the server to invalidate the session there.
-   It calls the `logout()` function from our `AuthContext`, setting `isAuthenticated` to `false`.
-   It redirects the user to the home page (`/`).

### `frontend/src/components/Navbar.jsx`

-   This component uses the `useAuth()` hook to get the `isAuthenticated` state.
-   It conditionally renders links. If the user is authenticated, it shows "Protected" and "Logout". If not, it shows "Login" and "Register".

### `frontend/src/components/ProtectedRoute.jsx`

-   This is a critical component for securing parts of our application.
-   It also uses the `useAuth()` hook.
-   If `isAuthenticated` is `true`, it renders its children (the actual protected page) using the `<Outlet />` component from `react-router-dom`.
-   If `isAuthenticated` is `false`, it uses the `<Navigate />` component to redirect the user to the `/login` page.

### `frontend/src/App.jsx`

-   This file defines the application's routes.
-   Notice how the `/protected` route is nested inside a `<Route>` that uses `<ProtectedRoute />` as its element. This is how we apply the protection to one or more routes.

This setup provides a robust, secure, and maintainable way to handle authentication in a modern React application.
