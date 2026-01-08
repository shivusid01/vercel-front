// src/components/home/Stats.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Stats = () => {
  const stats = [
    { number: '1,000+', label: 'Successful Students' },
    { number: '98%', label: 'Success Rate' },
    { number: '100+', label: 'Enrolled Per Session' },
    { number: '30+', label: 'Years Experience' }
  ]

  return (
    <motion.section 
      className="py-16 bg-gradient-to-b from-red-50 to-purple-50"
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
            Our Achievement in Numbers
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Join hundreds of students who have achieved their dreams with our guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="inline-block bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300">
            <span className="text-green-700 font-medium flex items-center justify-center">
              <motion.span 
                className="text-xl mr-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏆
              </motion.span>
              Ranked #1 Coaching Institute in Local for years
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Stats