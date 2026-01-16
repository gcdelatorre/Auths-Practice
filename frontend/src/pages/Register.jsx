import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/auth.api.js';

function Register() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // react-router hook for navigation
  const navigate = useNavigate();

  // Check if passwords match
  const passwordMatch = password === confirmPassword;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Make the API call to register the user
      await registerRequest(email, password);
      // If registration is successful, inform the user and redirect to login
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      // Improved error handling
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert('Registration failed: The server may be unreachable.');
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
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
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="******************"
            value={confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
          />
          {!passwordMatch && confirmPassword && (
            <p className="text-red-500 text-xs italic">Passwords do not match.</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              !email || !password || !confirmPassword || !passwordMatch
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
            type="submit"
            disabled={!email || !password || !confirmPassword || !passwordMatch}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
