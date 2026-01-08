// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    course: '',
    grade: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const courses = [
    'JEE Main & Advanced',
    'NEET UG',
    'UPSC Foundation',
    'CBSE 11-12 (Science)',
    'CBSE 11-12 (Commerce)',
    'CA Foundation',
    'Foundation (Class 9-10)',
    'Other'
  ]

  const grades = [
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
    'College 1st Year',
    'College 2nd Year',
    'College 3rd Year',
    'Graduate',
    'Working Professional'
  ]

  // Simulate loading for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.course) newErrors.course = 'Please select a course'
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        course: formData.course,
        grade: formData.grade
      }

      const result = await signup(payload)

      if (!result.success) {
        setErrors({ general: result.error || 'Registration failed. Please try again.' })
        return
      }

      navigate('/student/dashboard')

    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Loading Registration...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Preparing your journey to success
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 py-12 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with Animation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-purple-600 to-purple-900 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create Your Account
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Join thousands of successful students
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Registration Form with Animation */}
          <motion.div 
            className="card bg-gradient-to-br from-white to-red-50 rounded-2xl p-8 shadow-lg border border-red-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            whileHover={{ 
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
              borderColor: "#ef4444"
            }}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.span 
                className="mr-3"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                🎓
              </motion.span>
              Student Registration
            </motion.h2>
            
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  className="mb-6 p-4 bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 text-red-700 rounded-xl flex items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.span 
                    className="mr-3"
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-red-100 flex items-center">
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👤
                  </motion.span>
                  Personal Information
                </h3>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder="Enter your full name"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <AnimatePresence>
                      {errors.name && (
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
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
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
                          Email Address *
                        </span>
                      </label>
                      <motion.input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Enter your email"
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

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
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
                            📱
                          </motion.span>
                          Phone Number *
                        </span>
                      </label>
                      <motion.input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.phone 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Enter your phone"
                        whileFocus={{ scale: 1.01 }}
                      />
                      <AnimatePresence>
                        {errors.phone && (
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
                            {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Academic Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-red-100 flex items-center">
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  >
                    📚
                  </motion.span>
                  Academic Information
                </h3>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Course *
                    </label>
                    <motion.select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${
                        errors.course ? 'border-red-500' : 'border-gray-300'
                      }`}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </motion.select>
                    <AnimatePresence>
                      {errors.course && (
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
                          {errors.course}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Class/Grade
                    </label>
                    <motion.select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Select your grade</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </motion.select>
                  </motion.div>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-red-100 flex items-center">
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  >
                    🔒
                  </motion.span>
                  Set Password
                </h3>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <motion.input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder="Create a password"
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
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 6 characters long
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <motion.input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder="Confirm your password"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <AnimatePresence>
                      {errors.confirmPassword && (
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
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <motion.input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a href="#" className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-800">
                      Terms & Conditions
                    </a>
                  </motion.span>{' '}
                  and{' '}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a href="#" className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-800">
                      Privacy Policy
                    </a>
                  </motion.span>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3 }}
              >
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
                      className="flex items-center justify-center relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Account...
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
                        ✨
                      </motion.span>
                      Create Account
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
              </motion.div>

              {/* Login Link */}
              <motion.div
                className="text-center pt-4 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
              >
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/login" 
                      className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-800"
                    >
                      Sign in here
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </form>
          </motion.div>

          {/* Benefits & Info Sidebar */}
          <div className="space-y-8">
            {/* Why Register Card */}
            <motion.div 
              className="card bg-gradient-to-br from-white to-red-50 rounded-2xl p-8 shadow-lg border border-red-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, type: "spring" }}
              whileHover={{ 
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
                borderColor: "#ef4444"
              }}
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.span 
                  className="mr-3"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
                Why Register With Us?
              </motion.h2>
              <ul className="space-y-4">
                {[
                  "Free demo class before enrollment",
                  "Personalized study plan",
                  "Access to recorded lectures",
                  "Regular performance reports",
                  "24/7 doubt solving support",
                  "Scholarship opportunities"
                ].map((benefit, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span 
                      className="text-red-500 mr-3 text-xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      ✓
                    </motion.span>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Admission Process Card */}
            <motion.div 
              className="card bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg border border-purple-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, type: "spring" }}
              whileHover={{ 
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.1)",
                borderColor: "#7c3aed"
              }}
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <motion.span 
                  className="mr-3"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 4, repeat: Infinity },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  🚀
                </motion.span>
                Admission Process
              </motion.h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Registration", desc: "Fill this form to create your account" },
                  { step: "2", title: "Free Demo", desc: "Attend a free demo class of your choice" },
                  { step: "3", title: "Fee Payment", desc: "Complete fee payment online" },
                  { step: "4", title: "Start Learning", desc: "Access course material and join classes" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 + index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      scale: 1.02
                    }}
                  >
                    <motion.div 
                      className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-purple-100 flex items-center justify-center mr-4 border border-red-200"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 360,
                        background: "linear-gradient(to right, #ef4444, #7c3aed)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                        {item.step}
                      </span>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support Info */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-red-50 to-purple-50 rounded-2xl border border-red-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
              whileHover={{ 
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.1)",
                borderColor: "#ef4444"
              }}
            >
              <div className="flex items-center mb-4">
                <motion.span 
                  className="text-red-600 mr-3 text-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📞
                </motion.span>
                <span className="font-bold text-gray-900">Need Help?</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Our admission counselors are available 24/7 to assist you.
              </p>
              <div className="space-y-2">
                <motion.p 
                  className="text-red-700 font-medium flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    📱
                  </motion.span>
                  Call: +91 98765 43210
                </motion.p>
                <motion.p 
                  className="text-purple-700 font-medium flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    💬
                  </motion.span>
                  WhatsApp: +91 98765 43210
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="fixed bottom-8 right-8 z-40"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 2.5, type: "spring" }}
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
                🎯
              </motion.div>
              <div className="text-right">
                <div className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                  Join 10,000+ Students
                </div>
                <div className="text-sm text-gray-600">Start your success story</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Background Animated Particles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
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
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Signup