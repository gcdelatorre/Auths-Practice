// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getProtected } from '../api/auth.api';

// 1. Create the context
// This is the object that will be shared across our application.
const AuthContext = createContext();

// 2. Create the AuthProvider component
// This component will wrap our application and provide the authentication state and functions to its children.
export const AuthProvider = ({ children }) => {
  // Check for the access token in cookies to maintain the session on page refresh
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // This effect will run on the initial render and check if the user is already authenticated.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getProtected();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // 3. Provide the context value to the children
  // The value object contains the state and functions that we want to make available to our components.
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook for easy context consumption
// This hook will allow our components to easily access the authentication context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
