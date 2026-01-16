// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {

  // Checks the authentication status from the AuthContext that was passed down via the AuthProvider.
  const { isAuthenticated, loading } = useAuth();

  // While we are checking for authentication, we can show a loading indicator.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect them to the login page.
  // The 'replace' prop is used to replace the current entry in the history stack,
  // so the user won't be able to navigate back to the protected route after being redirected.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child routes.
  // The <Outlet /> component from react-router-dom will render the nested route components.
  return <Outlet />;
}

export default ProtectedRoute;
