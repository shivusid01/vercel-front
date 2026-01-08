// src/components/home/Features.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Features = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Expert Faculty',
      description: 'NTA UGC NET Cleared with 10+ years of teaching experience.'
    },
    {
      icon: '📚',
      title: 'Comprehensive Study Material',
      description: 'Curated notes, practice papers, and mock tests updated regularly.'
    },
    {
      icon: '💻',
      title: 'Live Interactive Classes',
      description: 'Real-time doubt solving and interactive sessions with teachers.'
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Detailed progress reports and personalized feedback.'
    },
    {
      icon: '🏆',
      title: 'Proven Success Rate',
      description: 'Consistent top ranks in State Boards and CBSE board exams.'
    },
    {
      icon: '📱',
      title: 'Mobile Learning',
      description: 'Learn anytime, anywhere with our mobile app and recorded lectures (Soon*).'
    }
  ]

  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Why Choose Sharma Institute?
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            We combine quality education with innovative technology to deliver exceptional results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="card hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 bg-gradient-to-b from-white to-gray-50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)"
              }}
            >
              <div className="flex flex-col items-center text-center p-6">
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:bg-gradient-to-r hover:from-red-600 hover:to-purple-900 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Features