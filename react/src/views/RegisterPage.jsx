import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [animateError, setAnimateError] = useState(false);
  const {setAuth} = useAuthStore();
  const  navigate = useNavigate();

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
      const res = await axios.post('/api/register', formData);
      console.log(res.data);

      const {user , token} = res.data;
        setAuth(user , token);
      // navigate to home
        navigate('/');

    } catch (error) {
      console.error(error.response.data);
      setErrors(error.response.data.errors);
      setAnimateError(true);

      setTimeout(() => {
        setAnimateError(false);
      }, 5000); 
    }
    // Reset form data
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  };

  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="flex flex-col-reverse lg:flex-row lg:space-x-12 space-y-8 lg:space-y-0 p-8 lg:p-20 bg-white shadow-lg rounded-lg max-w-7xl w-full">
        
        {/* Form Section */}
        <div className="card w-full lg:w-1/2 bg-white shadow-xl p-10 rounded-lg border border-gray-300">
          {/* Error Message Section */}
          {errors && Object.keys(errors).length > 0 && (
            <div
              style={{
                backgroundColor: 'red',
                color: 'white',
                textAlign: 'center',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                animation: animateError ? 'shake 0.3s' : 'none',
              }}
            >
              <ul>
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8">
              Sign Up
            </h1>

            {/* Name Input */}
            <div className="form-control">
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="input input-bordered w-full border-gray-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm"
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                value={formData.name}
              />
            </div>

            {/* Email Input */}
            <div className="form-control">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered w-full border-gray-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm"
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                value={formData.email}
              />
            </div>

            {/* Password Input */}
            <div className="form-control">
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered w-full border-gray-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm"
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                value={formData.password}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="form-control">
              <input 
                type="password" 
                placeholder="Confirm your password" 
                className="input input-bordered w-full border-gray-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 rounded-md p-3 text-gray-900 shadow-sm"
                onChange={(event) => setFormData({ ...formData, password_confirmation: event.target.value })}
                value={formData.password_confirmation}
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button 
                type="submit"
                className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                Sign Up
              </button>
            </div>

            {/* Login Prompt */}
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* Text Section */}
        <div className="text-center lg:text-left lg:w-1/2 flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6">
            Create Your Account
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            Join our contact manager platform to organize and manage your connections effortlessly.
            Sign up today to streamline your networking experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
