import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from './store/useAuthStore';
import HomePage from './views/HomePage';
import Login from './views/LoginPage';
import Register from './views/RegisterPage';
import Error404 from './views/Error404';

const App = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing authentication...');
      await checkAuth(); // This should trigger console logs in checkAuth
      setLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;
