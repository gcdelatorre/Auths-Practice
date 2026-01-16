import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  // Get the authentication state from the context
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-400">Home</Link>
        </li>

        {/* 
          Conditionally render links based on the authentication status.
          This is a common pattern for showing different UI to logged-in vs. logged-out users.
        */}
        {isAuthenticated ? (
          <>
            {/* These links are shown only to authenticated users */}
            <li>
              <Link to="/protected" className="text-white hover:text-gray-400">Protected</Link>
            </li>
            <li>
              <Link to="/logout" className="text-white hover:text-gray-400">Logout</Link>
            </li>
          </>
        ) : (
          <>
            {/* These links are shown only to unauthenticated users */}
            <li>
              <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
            </li>
            <li>
              <Link to="/register" className="text-white hover:text-gray-400">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
