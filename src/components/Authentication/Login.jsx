import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // React Router's useNavigate hook
import ForgotPasswordModal from './ForgotPasswordModal';
import LogoImage from '../../assets/images/logo.png';
import Slide1 from '../../assets/images/slide1.jpg';
import Slide2 from '../../assets/images/slide1.jpg';
import Slide3 from '../../assets/images/slide1.jpg';

function Login() {
  // State for capturing the email/username and password
  const [login, setLogin] = useState('');
  const [pswd, setPswd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeIndex, setActiveIndex] = useState(0);
  const textItems = [
    "Capturing Moments, Creating Memories",
    "Preserving Precious Times Forever",
    "Turning Special Moments into Stories",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % textItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Reset error message and set loading state
    setError('');
    setLoading(true);

    try {
      // Make POST request to the backend login API
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, pswd }),
      });

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();

        // Save the JWT token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        // Redirect based on the role
        switch (data.role) {
          case 'admin':
            navigate('/admin'); // Redirect to admin page
            break;
          case 'sales executive':
            navigate('/sales-executive/order'); // Redirect to sales page
            break;
          case 'finance':
            navigate('/finance'); // Redirect to finance page
            break;
          case 'client':
            navigate('/orders'); // Redirect to client page
            break;
          default:
            navigate('/'); // Default fallback route (if role is not recognized)
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-screen w-full bg-indigo-100 ">
      <div
        className="w-1/2 hidden lg:flex flex-col justify-between p-12 text-white border-r-2 border-indigo-500"
      >
        <div className="flex justify-between items-center">
          <img src={LogoImage} alt="Logo" className="h-8" />
          <Link
            to="/"
            className="relative flex items-center gap-1 text-sm font-medium text-white hover:text-white"
          >
            <div className="bg-indigo-500 px-3 py-1 rounded-full hover:bg-black">
              <span className="relative z-10 px-2 py-1 text-white hover:text-white">
                Back to website
              </span>
              <span className="relative z-10 text-white">→</span>
            </div>
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-end items-center">
          {/* Sliding Images */}
          <div className="relative w-full h-[560px] rounded-2xl overflow-hidden flex items-center justify-center">
            {[Slide1, Slide2, Slide3].map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className={`absolute w-full h-full object-cover transition-transform duration-700 ease-in-out`}
                style={{
                  transform: `translateX(${(index - activeIndex) * 100}%)`,
                  transition: 'transform 1s ease-in-out', // Smooth transition for sliding effect
                }}
              />
            ))}
          </div>

          {/* Span Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {textItems.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? "w-10 bg-indigo-500" : "w-2 bg-gray-400"}`}
              ></span>
            ))}
          </div>
        </div>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-3 sm:px-12 lg:px-0">
        <div className="w-full max-w-2xl py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-7 bg-indigo-50 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-indigo-500 text-center">
            Log in to your account
          </h2>

          {/* Login Form */}
          <div className="flex flex-col gap-4 mb-6">
            <input
              className="text-sm w-full px-4 py-4 border border-solid border-gray-300 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-indigo-500"
              type="text"
              placeholder="Email Address"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className="text-sm w-full px-4 py-4 border border-solid border-gray-300 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-indigo-500"
              type="password"
              placeholder=" Enter Password"
              value={pswd}
              onChange={(e) => setPswd(e.target.value)}
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-500 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-400">Remember me</label>
            </div>
            <button
              className="text-sm text-indigo-500 hover:underline"
              onClick={() => setShowForgotPassword(true)}
            >
              Forget Password?
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          {/* Login Button */}
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded transition-all duration-300"
            type="submit"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-sm text-gray-500 text-center">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>

      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </section>
  );
}

export default Login;
