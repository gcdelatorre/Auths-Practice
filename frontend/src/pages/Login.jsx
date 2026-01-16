import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Renaming the import to avoid conflict with the 'login' function from useAuth
import { login as loginRequest } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  // State for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get the login function from our custom useAuth hook
  const { login } = useAuth();
  // Get the navigate function from react-router-dom to redirect the user
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the API call to log the user in
      await loginRequest(email, password);
      // If the login is successful, update the global authentication state
      login();
      // Redirect the user to the protected page
      navigate('/protected');
    } catch (err) {
      // Improved error handling
      if (err.response) {
        // If the error has a response object, it's likely a controlled error from the server
        alert(err.response.data.message);
      } else {
        // If there is no response, it could be a network error or the server is down
        alert('Login failed: The server may be unreachable.');
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={handleChange}
            name="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              !email || !password
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
            type="submit"
            disabled={!email || !password}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
