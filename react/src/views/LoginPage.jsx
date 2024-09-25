import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [animateError, setAnimateError] = useState(false);
  const {setAuth} = useAuthStore();


  // Shake animation keyframes
  const shakeAnimation = `
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }
  `;

  // Injecting keyframes into the document
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(shakeAnimation));
  document.head.appendChild(style);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send form data to server
      const res = await axios.post('/api/login', formData);
      console.log(res.data);
      const {user , token} = res.data;

      setAuth(user , token);
      // navigate to home
      navigate('/');

    } catch (error) {
      // Check if the error response contains data
      if (error.response) {
        // If there are specific validation errors
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          // For invalid credentials or other general errors
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }

      // Trigger animation
      setAnimateError(true);
      setTimeout(() => {
        setAnimateError(false);
      }, 5000); // Keep the animation for 5 seconds
    }

    // Reset form
    setFormData({
      email: '',
      password: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="flex flex-col-reverse lg:flex-row lg:space-x-12 space-y-8 lg:space-y-0 p-8 lg:p-20 bg-white shadow-lg rounded-lg max-w-7xl w-full">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-white shadow-xl p-10 rounded-lg border border-gray-300">
          {/* Error Message Section */}
          {Object.keys(errors).length > 0 && (
            <div
              className={`bg-red-500 text-white text-center text-lm p-3 w-full mb-6 ${animateError ? 'animate-shake' : ''}`}
              style={{ animation: animateError ? 'shake 0.5s' : 'none' }}
            >
              <ul>
                {Object.entries(errors).map(([value], index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8">
              Welcome Back!
            </h1>

            {/* Email Input */}
            <div className="form-control">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full input input-bordered border-black bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm" 
                value={formData.email}
                onChange={(event) => setFormData({...formData, email: event.target.value})}
             
              />
            </div>

            {/* Password Input */}
            <div className="form-control">
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered w-full border-gray-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm" 
                value={formData.password}
                onChange={(event) => setFormData({...formData, password: event.target.value})}
                
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button 
                type="submit"
                className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>

            {/* Registration Prompt */}
            <p className="text-center text-gray-600 mt-4">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Register now
              </Link>
            </p>
          </form>
        </div>

        {/* Text Section */}
        <div className="text-center lg:text-left lg:w-1/2 flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6">
            Log In to Your Account
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            Access your contacts and manage your network effortlessly. Log in to explore features that help you organize your connections and enhance your networking experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
