// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/img.svg'

const Navbar = () => {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Navigation items with icons
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ]

  // Loading state with animation
  if (loading) {
    return (
      <motion.nav 
        className="bg-white shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="h-12 w-12 bg-gradient-to-r from-red-200 to-purple-200 rounded-xl animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="h-7 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-7 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <motion.nav 
      className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-xl bg-white/95 backdrop-blur-sm' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Larger */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <img src={logo} alt="Sharma Institute" className="h-14 w-20" />
              <motion.div 
                className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-red-300"
                initial={false}
                animate={scrolled ? { scale: 1 } : { scale: 1.05 }}
              />
            </motion.div>
            <div className="hidden md:block">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Sharma Institute
              </motion.span>
              <motion.p 
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Excellence in Education
              </motion.p>
            </div>
          </Link>

          {/* Desktop Navigation Links with Icons */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link 
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-50 to-purple-50 text-red-600 border border-red-200' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <motion.span 
                      className="text-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-900"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
            
            {/* Conditional Links based on Auth State */}
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {user.role === 'student' && (
                  <Link 
                    to="/student/dashboard" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
                  >
                    <span className="text-lg">📊</span>
                    <span>Dashboard</span>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
                  >
                    <span className="text-lg">👨‍💼</span>
                    <span>Admin Panel</span>
                  </Link>
                )}
              </motion.div>
            )}
          </div>

          {/* Auth Buttons & User Info - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="flex items-center space-x-3 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white font-bold text-lg relative z-10">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-red-500"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-gray-700 font-medium text-sm group-hover:text-red-600 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {user.name || user.email}
                    </motion.p>
                    <motion.p 
                      className="text-xs text-gray-500 capitalize bg-gradient-to-r from-red-100 to-purple-100 px-2 py-0.5 rounded-full inline-block"
                      whileHover={{ scale: 1.1 }}
                    >
                      {user.role}
                    </motion.p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="relative px-5 py-2 bg-gradient-to-r from-red-600 to-purple-900 text-white rounded-lg hover:shadow-lg font-medium overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">🚪</span>
                    Logout
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 px-5 py-2 text-gray-700 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-300 group"
                >
                  <motion.span 
                    className="text-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    🔑
                  </motion.span>
                  <span>Login</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-purple-900 text-white rounded-lg hover:shadow-lg font-medium overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">📝</span>
                    Sign Up
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <motion.svg 
                className="w-7 h-7"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg 
                className="w-7 h-7"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </motion.button>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden border-t border-gray-200 bg-white"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 px-4">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link 
                          to={item.path}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-red-50 to-purple-50 text-red-600' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <motion.span 
                            className="text-xl"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {item.icon}
                          </motion.span>
                          <span className="text-lg">{item.label}</span>
                          {isActive && (
                            <motion.div 
                              className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-purple-900"
                              layoutId="mobileActiveDot"
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                  
                  {/* Conditional Mobile Links */}
                  {isAuthenticated && user && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                    >
                      {user.role === 'student' && (
                        <Link 
                          to="/student/dashboard" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-xl">📊</span>
                          <span className="text-lg">Dashboard</span>
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-xl">👨‍💼</span>
                          <span className="text-lg">Admin Panel</span>
                        </Link>
                      )}
                    </motion.div>
                  )}

                  {/* Mobile Auth Section */}
                  <motion.div 
                    className="pt-4 border-t border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                  >
                    {isAuthenticated && user ? (
                      <>
                        <motion.div 
                          className="flex items-center space-x-3 mb-4 p-4 bg-gradient-to-r from-red-50 to-purple-50 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.div 
                            className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center shadow-md"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <span className="text-white font-bold text-xl">
                              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name || user.email}</p>
                            <p className="text-sm text-gray-600 capitalize bg-gradient-to-r from-red-100 to-purple-100 px-2 py-0.5 rounded-full inline-block">
                              {user.role}
                            </p>
                          </div>
                        </motion.div>
                        <motion.button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-purple-900 text-white rounded-lg hover:shadow-lg font-medium flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-lg">🚪</span>
                          <span>Logout</span>
                        </motion.button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link 
                          to="/login" 
                          className="w-full px-4 py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center space-x-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">🔑</span>
                          <span>Login</span>
                        </Link>
                        <Link 
                          to="/signup" 
                          className="w-full px-4 py-3 text-center bg-gradient-to-r from-red-600 to-purple-900 text-white rounded-lg hover:shadow-lg font-medium flex items-center justify-center space-x-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">📝</span>
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar