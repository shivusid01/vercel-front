// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import Features from '../components/home/Features'
import Stats from '../components/home/Stats'
import Testimonials from '../components/home/Testimonials'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

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
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-900 rounded-full"></div>
            </motion.div>
          </div>
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Welcome to Sharma Institute...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Preparing your academic excellence journey
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <HeroSection />
      <Features />
      <Stats />
      <Testimonials />
      
      {/* Call to Action */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-red-600 to-purple-900"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p 
            className="text-red-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Join thousands of successful students who achieved their dreams with our guidance.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
              <Link 
    to="/signup" 
  className="btn-primary bg-gradient-to-r from-red-600 to-purple-900 text-white hover:from-red-700 hover:to-purple-950 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center py-3 px-8 rounded-xl font-bold text-lg"
  >
    Get Started Free
  </Link>
  <Link 
    to="/courses" 
    className="btn-secondary bg-gradient-to-r from-red-100 to-purple-100 text-red-800 hover:text-red-900 hover:from-red-200 hover:to-purple-200 hover:shadow-lg hover:scale-105 border border-red-200 transition-all duration-300 text-center py-3 px-8 rounded-xl font-bold text-lg"
  >
    Browse Courses
  </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home