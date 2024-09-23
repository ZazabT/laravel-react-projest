import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const { user, token, clearAuth } = useAuthStore(); // Access user and token from the store
  const navigate = useNavigate();
  console.log('Initial token in localStorage:', localStorage.getItem('token'));
  const handleLogout = async () => {
    try {
      if (!token) {
        throw new Error('No token found for logout'); // Handle case where token is null
      }
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      clearAuth(); // Clear auth data
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Check if user data is available
  if (!user) {
    return <div>Loading user data...</div>; // Add a loading state or redirect
  }

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome, {user.name}</h2>
      <h3>Email: {user.email}</h3>
      
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
