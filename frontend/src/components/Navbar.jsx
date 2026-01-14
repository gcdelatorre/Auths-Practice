import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-400">Home</Link>
        </li>
        <li>
          <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
        </li>
        <li>
          <Link to="/register" className="text-white hover:text-gray-400">Register</Link>
        </li>
        <li>
          <Link to="/protected" className="text-white hover:text-gray-400">Protected</Link>
        </li>
        <li>
          <Link to="/logout" className="text-white hover:text-gray-400">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
