import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Protected from './pages/Protected';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* 
          Protected Routes
          The ProtectedRoute component is used as a wrapper for routes that require authentication.
          If the user is authenticated, it will render the child component (in this case, an Outlet that renders the nested route).
          If the user is not authenticated, it will redirect them to the /login page.
        */}
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<Protected />} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
