// src/pages/About.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const About = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for animations
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const teamMembers = [
    { 
      name: 'Jeetlal Sharma', 
      role: 'Founder & CEO', 
      exp: '30+ years', 
      avatar: 'JS',
      category: 'leadership',
      description: 'Education visionary with 3 decades of teaching experience.',
      achievements: ['MSc Mathematics', 'Founded 1993', 'Mentored 5000+ students']
    },
    { 
      name: 'Miss Meenu Sharma', 
      role: 'Co-Founder', 
      exp: '11+ years', 
      avatar: 'MS',
      category: 'leadership',
      description: 'Expert in student psychology and academic planning.',
      achievements: ['MEd, BEd', 'Student Counseling', 'Curriculum Design']
    },
    { 
      name: 'Mr. Chandra Bhushan', 
      role: 'Operations Head', 
      exp: '9+ years', 
      avatar: 'CB',
      category: 'operations',
      description: 'Specializes in institute management and student affairs.',
      achievements: ['MBA', 'Process Optimization', 'Student Support']
    },
    { 
      name: 'Mr. Ashok Kumar', 
      role: 'Academics & Competition Head', 
      exp: '8+ years', 
      avatar: 'AK',
      category: 'academics',
      description: 'Competitive exam expert with proven track record.',
      achievements: ['NET Qualified', 'Exam Strategist', 'Result-Oriented']
    },
  
   
  ]

  const categories = [
    { name: 'All Team', value: 'all', count: teamMembers.length },
    // { name: 'Leadership', value: 'leadership', count: teamMembers.filter(m => m.category === 'leadership').length },
    // { name: 'Faculty', value: 'faculty', count: teamMembers.filter(m => m.category === 'faculty').length },
    // { name: 'Operations', value: 'operations', count: teamMembers.filter(m => m.category === 'operations').length },
    // { name: 'Support', value: 'support', count: teamMembers.filter(m => m.category === 'support').length }
  ]

  const filteredTeam = activeFilter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === activeFilter)

  const timelineData = [
    { year: '1993', title: 'Foundation', description: 'Started as Home tuition in Ramaglass', icon: '🏠' },
    { year: '2005', title: 'First Center', description: 'Opened first official coaching center', icon: '🏫' },
    { year: '2012', title: 'Expansion', description: 'Opened 5 new centers across North India', icon: '📍' },
    { year: '2016', title: 'Digital Transformation', description: 'Launched online learning platform', icon: '💻' },
    { year: '2020', title: 'Nationwide Reach', description: 'Expanded to 50+ cities across India', icon: '🇮🇳' },
    { year: '2024', title: 'Current', description: 'Serving 10,000+ students annually', icon: '🚀' }
  ]

  const stats = [
    { number: '30+', label: 'Years Experience', icon: '📅' },
    { number: '10,000+', label: 'Students Yearly', icon: '👨‍🎓' },
    { number: '95%', label: 'Success Rate', icon: '🏆' },
    { number: '50+', label: 'Cities Across India', icon: '📍' }
  ]

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
            Preparing your journey through excellence
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-white to-red-50">
      {/* Hero Section with Animation */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-purple-600 to-purple-900 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          About Sharma Institute
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Empowering students since 1993 with quality education and innovative learning solutions.
        </motion.p>
        
        {/* Stats with Animation */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:border-purple-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
                borderColor: "#7c3aed"
              }}
            >
              <motion.div 
                className="text-3xl mb-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Mission & Vision with Animation */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div 
          className="card bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg border border-red-100"
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#ef4444"
          }}
        >
          <motion.div 
            className="text-4xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🎯
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            To provide accessible, high-quality education that empowers students to achieve 
            their academic goals and build successful careers.
          </p>
          <ul className="space-y-3">
            {['Personalized learning paths', 'Expert faculty guidance', 'Regular performance tracking'].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-center text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <motion.span 
                  className="text-red-500 mr-3 text-xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                >
                  ✓
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          className="card bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg border border-purple-100"
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.1)",
            borderColor: "#7c3aed"
          }}
        >
          <motion.div 
            className="text-4xl mb-4"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            🌟
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-4">
            To become India's most trusted coaching institute by transforming education 
            through technology and innovation.
          </p>
          <ul className="space-y-3">
            {['Digital-first learning approach', 'Wide reach with local impact', 'Continuous innovation in teaching methods'].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-center text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <motion.span 
                  className="text-purple-500 mr-3 text-xl"
                  animate={{ 
                    x: [0, 8, 0],
                    color: ["#7c3aed", "#9333ea", "#7c3aed"]
                  }}
                  transition={{ 
                    x: { repeat: Infinity, duration: 1.5, delay: index * 0.2 },
                    color: { duration: 2, repeat: Infinity }
                  }}
                >
                  →
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Timeline with Animation */}
      <div className="mb-20">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 text-center mb-12 bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          Our Journey
        </motion.h2>
        <div className="relative">
          {/* Animated Timeline line */}
          <motion.div 
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 via-purple-500 to-purple-900"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
          
          {/* Timeline items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div 
                key={index} 
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
              >
                {/* Animated Timeline dot */}
                <motion.div 
                  className="absolute left-1/2 transform -translate-x-1/2 md:left-1/2 z-10 h-6 w-6 rounded-full bg-gradient-to-r from-red-600 to-purple-900 shadow-lg"
                  whileHover={{ scale: 1.5 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0)",
                      "0 0 0 12px rgba(239, 68, 68, 0.3)",
                      "0 0 0 0 rgba(239, 68, 68, 0)"
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    boxShadow: { repeat: Infinity, duration: 2, delay: index * 0.3 }
                  }}
                />
                
                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <motion.div 
                    className="card bg-white inline-block max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-red-200"
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: "#ef4444"
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <motion.div 
                        className="text-2xl mr-3"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                        {item.year}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </motion.div>
                </div>
                
                {/* Empty space for the other side */}
                <div className="md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section with Filters */}
      <div className="mb-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
            Meet Our Leadership
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our dedicated team of educators and administrators working together for student success.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveFilter(category.value)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category.value
                    ? 'bg-gradient-to-r from-red-600 to-purple-900 text-white shadow-lg shadow-purple-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
              >
                {category.name}
                <span className={`ml-2 text-sm ${activeFilter === category.value ? 'opacity-90' : 'opacity-75'}`}>
                  ({category.count})
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Team Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTeam.map((member, index) => (
              <motion.div 
                key={index}
                className="card bg-gradient-to-b from-white to-red-50 rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:border-red-200 group overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px rgba(239, 68, 68, 0.1)"
                }}
                layout
              >
                {/* Avatar with Animation */}
                <motion.div 
                  className="relative h-28 w-28 rounded-full bg-gradient-to-r from-red-600 to-purple-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                  animate={{ 
                    rotateY: [0, 90]
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" }
                  }}
                >
                  <span className="text-3xl font-bold text-white relative z-10">{member.avatar}</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                
                {/* Name and Role */}
                <motion.h3 
                  className="text-xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-purple-900 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {member.name}
                </motion.h3>
                <div className="text-gray-600 mb-2">{member.role}</div>
                <motion.div 
                  className="text-sm font-medium mb-3"
                  animate={{ 
                    background: [
                      'linear-gradient(to right, #ef4444, #7c3aed)',
                      'linear-gradient(to right, #7c3aed, #4c1d95)',
                      'linear-gradient(to right, #4c1d95, #ef4444)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {member.exp} experience
                </motion.div>
                
                {/* Description (Hover Reveal) */}
                <motion.div 
                  className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100"
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-2">{member.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.achievements.map((achievement, idx) => (
                      <motion.span 
                        key={idx} 
                        className="px-2 py-1 bg-gradient-to-r from-red-50 to-purple-50 text-red-600 text-xs rounded border border-red-100"
                        whileHover={{ scale: 1.05 }}
                      >
                        {achievement}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Section with Animation */}
      <motion.div 
        className="relative rounded-2xl p-8 md:p-12 text-center text-white overflow-hidden mb-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        {/* Gradient Background with Animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 to-purple-900"
          animate={{ 
            background: [
              'linear-gradient(to right, #ef4444, #7c3aed, #4c1d95)',
              'linear-gradient(to right, #7c3aed, #4c1d95, #ef4444)',
              'linear-gradient(to right, #4c1d95, #ef4444, #7c3aed)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Animated Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-white/10 to-purple-900/0"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        
        <div className="relative z-10">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p 
            className="mb-6 text-red-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
          >
            Join thousands of successful students who transformed their education and careers with our guidance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, type: "spring" }}
          >
            <Link to="/signup" className="relative inline-flex items-center gap-2 bg-white text-red-600 hover:text-purple-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group">
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                Get Started Today
              </motion.span>
              <motion.svg 
                className="w-5 h-5 relative z-10"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-50 to-purple-50"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Social Proof */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 3, type: "spring" }}
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
              ⭐
            </motion.div>
            <div className="text-right">
              <div className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                Rated 4.9/5
              </div>
              <div className="text-sm text-gray-600">by 2000+ students</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About