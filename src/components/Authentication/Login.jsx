import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router's useNavigate hook

function Login() {
  // State for capturing the email/username and password
  const [login, setLogin] = useState('');
  const [pswd, setPswd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

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
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        {/* Login Form */}
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
          value={login}
          onChange={(e) => setLogin(e.target.value)} // Update login state
        />
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
          value={pswd}
          onChange={(e) => setPswd(e.target.value)} // Update password state
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
          <a className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4" href="#">
            Forgot Password?
          </a>
        </div>
        
        {/* Error Message */}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Submit Button */}
        <div className="text-center md:text-left">
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
            onClick={handleLogin}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don't have an account? <a className="text-red-600 hover:underline hover:underline-offset-4" href="#">Register</a>
        </div>
      </div>
    </section>
  );
}

export default Login;
