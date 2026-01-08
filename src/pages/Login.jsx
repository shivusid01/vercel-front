import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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

  const { login } = useAuth();
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
    if (!formData.password) newErrors.password = "Password is required";
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
      console.log("📤 Calling login function with:", {
        email: formData.email,
        passwordLength: formData.password.length
      });

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("📥 Login result received:", {
        success: result?.success,
        userExists: !!result?.user,
        userRole: result?.user?.role,
        error: result?.error
      });

      if (!result || !result.success) {
        console.error("❌ Login failed in handleSubmit");
        setErrors({ 
          general: result?.error || "Invalid email or password" 
        });
        return;
      }

      if (!result.user) {
        console.error("❌ No user in result");
        setErrors({ 
          general: "User data not received. Please try again." 
        });
        return;
      }

      console.log("✅✅✅ LOGIN SUCCESSFUL! Ready to redirect...");
      console.log("👤 User role:", result.user.role);
      console.log("📍 Current URL:", window.location.href);

      // ✅ FIX: Use window.location for guaranteed redirect
      // This ALWAYS works
      if (result.user.role === "admin") {
        console.log("🚀 Redirecting to admin dashboard...");
        // Method 1: Direct URL change (most reliable)
        window.location.href = "/admin/dashboard";
        // Method 2: Alternative
        // window.location.assign("/admin/dashboard");
      } else {
        console.log("🚀 Redirecting to student dashboard...");
        window.location.href = "/student/dashboard";
      }

      // Optional: Also try navigate as backup
      setTimeout(() => {
        console.log("🔄 Trying navigate as backup...");
        if (result.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      }, 100);

    } catch (error) {
      console.error("🔥 Unexpected error in handleSubmit:", error);
      setErrors({ 
        general: "Login failed. Please try again." 
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
            Preparing your secure access
          </motion.p>
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
                  Signing in...
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
                <div className="text-sm text-gray-600">100% Protected</div>
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