import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for animations
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const { login: updateAuthContext } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Login form submitted");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("❌ Validation errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log("📤 Calling authAPI.login with:", {
        email: formData.email,
        baseURL: "https://event-backend-brown.vercel.app"
      });

      // ✅ Use authAPI.login with deployed backend
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("📥 Login API response:", response);

      // Check if response exists
      if (!response) {
        console.error("❌ No response from server");
        setErrors({ 
          general: "Server not responding. Please try again." 
        });
        return;
      }

      // Axios wraps the actual response in data property
      const result = response.data;
      
      console.log("📦 Response data:", result);

      if (!result || !result.success) {
        console.error("❌ API login failed:", result?.message);
        setErrors({ 
          general: result?.message || "Invalid email or password" 
        });
        return;
      }

      if (!result.user) {
        console.error("❌ No user in API response");
        setErrors({ 
          general: "User data not received. Please try again." 
        });
        return;
      }

      console.log("✅✅✅ LOGIN SUCCESSFUL via deployed backend!");
      console.log("👤 User data:", {
        id: result.user._id || result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        token: result.token ? "Present" : "Missing"
      });

      // ✅ Update auth context if needed
      if (updateAuthContext && typeof updateAuthContext === 'function') {
        console.log("🔄 Updating auth context...");
        await updateAuthContext({
          success: true,
          user: result.user,
          token: result.token,
          message: result.message
        });
        console.log("✅ Auth context updated");
      }

      console.log("📍 Current URL:", window.location.href);

      // ✅ Determine redirect URL based on user role
      let redirectUrl = "/student/dashboard";
      if (result.user.role === "admin") {
        redirectUrl = "/admin/dashboard";
      }

      console.log(`🚀 Redirecting to: ${redirectUrl}`);

      // ✅ Store auth data in localStorage for persistence
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // ✅ Use window.location for guaranteed redirect
      window.location.href = redirectUrl;

      // Optional: Also try navigate as backup
      setTimeout(() => {
        console.log("🔄 Trying navigate as backup...");
        navigate(redirectUrl, { replace: true });
      }, 100);

    } catch (error) {
      console.error("🔥 API Error in handleSubmit:", {
        name: error.name,
        message: error.message,
        response: error.response,
        request: error.request
      });

      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        console.error(`❌ Server error ${status}:`, data);
        
        if (status === 401) {
          errorMessage = "Invalid email or password";
        } else if (status === 404) {
          errorMessage = "User not found";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        // Request was made but no response
        console.error("❌ No response from server");
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else {
        // Something else happened
        console.error("❌ Request setup error:", error.message);
      }

      setErrors({ 
        general: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-6"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-full"></div>
            </motion.div>
          </div>
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Sharma Institute...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Connecting to secure server...
          </motion.p>
          <motion.div
            className="mt-6 text-sm text-gray-500"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1 }}
          >
            <p>Backend: https://event-backend-brown.vercel.app</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 flex items-center justify-center py-12 px-4">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with Animation */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 via-purple-600 to-purple-900 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Sign in to your account to continue
          </motion.p>
          <motion.div 
            className="mt-2 text-sm text-green-600 bg-green-50 inline-block px-3 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            ✅ Connected to Secure Server
          </motion.div>
        </motion.div>

        {/* Form Card with Animation */}
        <motion.div 
          className="card bg-gradient-to-br from-white to-red-50 rounded-2xl p-8 shadow-lg border border-red-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#ef4444"
          }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚠️
                  </motion.span>
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <motion.span 
                      className="mr-2"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📧
                    </motion.span>
                    Email Address
                  </span>
                </label>
                <motion.input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                  }`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 flex items-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <motion.span 
                        className="mr-1"
                        animate={{ 
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⚠️
                      </motion.span>
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <motion.span 
                      className="mr-2"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      🔒
                    </motion.span>
                    Password
                  </span>
                </label>
                <motion.input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 flex items-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <motion.span 
                        className="mr-1"
                        animate={{ 
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⚠️
                      </motion.span>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg relative overflow-hidden transition-all duration-300 ${
                isSubmitting 
                  ? "bg-gradient-to-r from-red-400 to-purple-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-800"
              }`}
              whileHover={{ 
                scale: isSubmitting ? 1 : 1.03,
                boxShadow: isSubmitting ? "none" : "0 10px 30px rgba(239, 68, 68, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <motion.span 
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Connecting to server...
                </motion.span>
              ) : (
                <motion.span 
                  className="relative z-10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔑
                  </motion.span>
                  Sign In
                </motion.span>
              )}
              {/* Animated Button Background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-800"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Sign Up Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signup" 
                    className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-800 transition-all duration-300"
                  >
                    Sign up now
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Floating Animation Elements */}
        <motion.div
          className="fixed bottom-8 right-8 z-40 hidden md:block"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 2, type: "spring" }}
        >
          <div className="bg-white rounded-full p-4 shadow-2xl border border-red-200 hover:border-purple-600 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <motion.div 
                className="text-2xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                🚀
              </motion.div>
              <div className="text-right">
                <div className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                  Secure Login
                </div>
                <div className="text-sm text-gray-600">Backend Connected</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Background Animated Particles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-300 to-purple-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;