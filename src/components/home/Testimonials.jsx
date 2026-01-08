// src/components/home/Testimonials.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Riyan Shrivastava',
      course: 'Intermediate',
      avatar: 'RS',
      text: 'Sharma Institute stands out as an exeptional coaching center, offering a unique one-on-one mentoring approach that truly caters to individual students needs!',
      rating: 5
    },
    {
      name: 'Ajay Sharma',
      course: 'Graduation',
      avatar: 'AS',
      text: 'The personalized attention and doubt-solving sessions were game-changers for my B.com preparation.',
      rating: 5
    },
    {
      name: 'Anish Kumar',
      course: 'SSC GD',
      avatar: 'AK',
      text: 'Comprehensive coverage of current affairs and excellent mentorship helped me in prepration of my SSC GD Exam.',
      rating: 5
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
            What Our Students Say
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Hear from our successful students who achieved their dreams with our guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="card hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 bg-gradient-to-b from-white to-gray-50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)"
              }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-red-100 to-purple-100 flex items-center justify-center mr-4 shadow-md"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <span className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                      {testimonial.avatar}
                    </span>
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.course}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span 
                      key={i} 
                      className="text-yellow-400 text-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Testimonials