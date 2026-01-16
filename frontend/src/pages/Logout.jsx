import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Renaming the import to avoid conflict with the 'logout' function from useAuth
import { logout as logoutRequest } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Logout() {
  // Get the logout function from our custom useAuth hook
  const { logout } = useAuth();
  // Get the navigate function from react-router-dom to redirect the user
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Attempt to log the user out on the server side
        await logoutRequest();
      } catch (err) {
        // Even if the server request fails, we'll proceed with logging out the client
        console.error('Server logout failed', err);
      } finally {
        // Update the global authentication state so that the isAuthenticated value now becomes false 
        logout();
        // Redirect the user to the home page
        navigate('/');
      }
    };

    handleLogout();
  }, [logout, navigate]);

  // This component does not render any UI, it's purely for handling the logout logic
  return null;
}

export default Logout;
