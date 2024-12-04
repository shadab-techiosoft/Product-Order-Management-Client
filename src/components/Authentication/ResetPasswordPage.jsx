import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const { resetToken } = useParams();  // Getting resetToken from URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If resetToken is not available in the URL, redirect or show error
    if (!resetToken) {
      toast.error("Invalid or missing reset token");
      navigate("/login");  // Redirect to login page or show some other fallback
    }
  }, [resetToken, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        navigate("/login");  // Redirect to login after password reset
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 py-12 px-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8 transform transition duration-500 hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
