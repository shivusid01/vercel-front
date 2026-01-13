// src/pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { classAPI, noticeAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [recentNotices, setRecentNotices] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      fetchRecentNotices()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulate loading delay for animation
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Fetch upcoming classes (visible to all students)
      const upcomingResponse = await classAPI.getUpcomingClasses()
      if (upcomingResponse.data.success) {
        setUpcomingClasses(upcomingResponse.data.classes || [])
      }
      
      // Fetch live classes
      const liveResponse = await classAPI.getLiveClasses()
      if (liveResponse.data.success) {
        setLiveClasses(liveResponse.data.classes || [])
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentNotices = async () => {
    try {
      const response = await noticeAPI.getStudentNotices({
        page: 1,
        limit: 3
      })
      if (response.data.success) {
        setRecentNotices(response.data.notices || [])
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
    }
  }

// 🔥 FIXED: handleJoinClass in StudentDashboard
const handleJoinClass = async (classItem, e) => {
  // ✅ IMPORTANT: Prevent default form submission
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  console.log('🎯 Joining class from dashboard:', classItem._id);
  console.log('🔗 Meeting link:', classItem.meetingLink);
  
  // ✅ Open meeting link in NEW TAB immediately
  if (classItem.meetingLink) {
    // Clean the link - remove any extra spaces
    const cleanLink = classItem.meetingLink.trim();
    
    // Check if it's a valid URL
    if (cleanLink.startsWith('http')) {
      console.log('📤 Opening link:', cleanLink);
      window.open(cleanLink, '_blank', 'noopener,noreferrer');
    } else {
      // If it's not a full URL, make it one
      const fullLink = cleanLink.includes('http') ? cleanLink : `https://${cleanLink}`;
      console.log('📤 Opening full link:', fullLink);
      window.open(fullLink, '_blank', 'noopener,noreferrer');
    }
  } else {
    alert('Meeting link not available for this class');
    return;
  }
  
  // Optional: Mark as joined in backend
  try {
    await classAPI.joinClass(classItem._id);
  } catch (apiError) {
    console.warn('Could not update join status:', apiError.message);
  }
};

  // Format time function
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading Animation
  if (loading) {
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
            Loading Sharma Institute...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Preparing your learning journey
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-red-50">
      {/* Welcome Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {user?.name || 'Student'}! 👋
            </motion.h1>
            <motion.p 
              className="text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Check your upcoming classes and join live sessions
            </motion.p>
          </div>
          <motion.div 
            className="bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 px-4 py-2 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-700">
              <span className="font-medium">Next Class:</span> {
                upcomingClasses.length > 0 
                  ? `${upcomingClasses[0].subject} at ${formatTime(upcomingClasses[0].startTime)}`
                  : 'No upcoming classes'
              }
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Live Classes Section */}
      <AnimatePresence>
        {liveClasses.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                className="text-2xl font-bold text-gray-900 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="h-3 w-3 bg-red-600 rounded-full mr-3"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Live Classes
              </motion.h2>
              <Link 
                to="/student/classes" 
                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
              >
                View All Classes
                <motion.svg 
                  className="w-4 h-4 ml-2"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((classItem, index) => (
                <motion.div 
                  key={classItem._id}
                  className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <motion.span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 10px rgba(239, 68, 68, 0.3)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                        }}
                        transition={{ 
                          scale: { duration: 0.3 },
                          boxShadow: { repeat: Infinity, duration: 2 }
                        }}
                      >
                        🎥 LIVE NOW
                      </motion.span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{classItem.subject}</h3>
                      <p className="text-gray-700">{classItem.topic}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <motion.span 
                          className="text-gray-600 mr-2"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          👨‍🏫
                        </motion.span>
                        <span>{classItem.instructorName}</span>
                      </div>
                      <div className="text-gray-600">
                        {classItem.studentCount || 0} students joined
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleJoinClass(classItem)}
                      className="w-full bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white py-3 rounded-lg font-medium flex items-center justify-center relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center">
                        {classItem.isJoined ? (
                          <>
                            <motion.span 
                              className="mr-2"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              ↻
                            </motion.span>
                            Rejoin Class
                          </>
                        ) : (
                          <>
                            <motion.span 
                              className="mr-2"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            >
                              🚀
                            </motion.span>
                            Join Class Now
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Classes Section */}
      <motion.div 
        className="card bg-gradient-to-br from-white to-red-50 border border-gray-100 rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Upcoming Classes
          </motion.h2>
          <Link 
            to="/student/classes" 
            className="text-red-600 hover:text-red-700 font-medium flex items-center group"
          >
            View Full Schedule
            <motion.svg 
              className="w-4 h-4 ml-2"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </Link>
        </div>
        
        {upcomingClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.slice(0, 3).map((classItem, index) => (
              <motion.div 
                key={classItem._id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 bg-white hover:border-red-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-purple-100 text-red-800 border border-red-200"
                      whileHover={{ scale: 1.1 }}
                    >
                      📅 {classItem.subject}
                    </motion.span>
                    <h3 className="font-bold text-gray-900 mt-2">{classItem.topic}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(classItem.startTime).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                      {new Date(classItem.startTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <motion.span 
                      className="mr-2"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      👨‍🏫
                    </motion.span>
                    <span>{classItem.instructorName}</span>
                  </div>

                  <motion.button
                    onClick={() => window.open(classItem.meetingLink, '_blank')}
                    className="w-full bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white py-2 rounded-lg font-medium relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Join Class</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span 
              className="text-4xl mb-4 block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📅
            </motion.span>
            <p className="text-gray-600">No upcoming classes scheduled</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for new classes</p>
          </motion.div>
        )}
      </motion.div>

      {/* Recent Notices Section */}
      <motion.div 
        className="card bg-gradient-to-br from-white to-purple-50 border border-gray-100 rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <motion.h2 
              className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Recent Notices
            </motion.h2>
            {unreadCount > 0 && (
              <motion.span 
                className="ml-3 px-2 py-1 bg-gradient-to-r from-red-100 to-purple-100 text-red-800 text-xs font-medium rounded-full border border-red-200"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {unreadCount} new
              </motion.span>
            )}
          </div>
          <Link 
            to="/student/notices" 
            className="text-red-600 hover:text-red-700 font-medium flex items-center group"
          >
            View All
            <motion.svg 
              className="w-4 h-4 ml-1"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </Link>
        </div>

        <AnimatePresence>
          {recentNotices.length > 0 ? (
            <div className="space-y-4">
              {recentNotices.map((notice, index) => (
                <motion.div
                  key={notice._id}
                  className={`p-6 border rounded-xl transition-all duration-200 ${
                    !notice.isRead 
                      ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50' 
                      : 'border-gray-200 hover:border-red-200 bg-white'
                  } ${notice.isImportant ? 'border-l-4 border-l-red-500' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {!notice.isRead && (
                          <motion.span 
                            className="h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-purple-500 mt-3 flex-shrink-0"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                        <div>
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {notice.title}
                            </h3>
                            {notice.isImportant && (
                              <motion.span 
                                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-purple-100 text-red-800 rounded-full text-sm font-medium border border-red-200"
                                whileHover={{ scale: 1.1 }}
                              >
                                ⚠️ Important
                              </motion.span>
                            )}
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-4 mt-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <motion.span 
                                className="mr-2"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                {notice.category === 'general' ? '📢' : 
                                 notice.category === 'exam' ? '📝' :
                                 notice.category === 'payment' ? '💰' :
                                 notice.category === 'holiday' ? '🎉' :
                                 notice.category === 'academic' ? '🎓' :
                                 notice.category === 'event' ? '🎪' : '⚙️'}
                              </motion.span>
                              {notice.category?.charAt(0).toUpperCase() + notice.category?.slice(1) || 'General'}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📅</span>
                              {new Date(notice.publishDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notice.isRead && (
                        <motion.button 
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                          whileHover={{ scale: 1.1 }}
                        >
                          Mark Read
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {notice.publishedBy?.name && (
                        <div>
                          <span className="font-medium">Posted by: </span>
                          {notice.publishedBy.name}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/student/notices/${notice._id}`} 
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center group"
                    >
                      Read More
                      <motion.svg 
                        className="w-4 h-4 ml-1"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📭
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Notices Found</h3>
              <p className="text-gray-600">
                Check back later for new announcements.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        {[
          { to: '/student/classes', icon: '🎓', label: 'My Classes', color: 'from-red-50 to-red-100' },
          { to: '/student/payment', icon: '💰', label: 'Pay Fees', color: 'from-green-50 to-green-100' },
          { to: '/student/notices', icon: '📢', label: 'Notices', color: 'from-yellow-50 to-yellow-100' },
          { to: '/student/profile', icon: '👤', label: 'Profile', color: 'from-purple-50 to-purple-100' },
          { to: '/student/payment-history', icon: '📋', label: 'Payment History', color: 'from-indigo-50 to-indigo-100' }
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 + index * 0.1 }}
          >
            <Link 
              to={item.to} 
              className={`flex flex-col items-center justify-center p-4 bg-gradient-to-r ${item.color} rounded-lg hover:shadow-lg transition-all duration-300 border border-gray-200`}
            >
              <motion.span 
                className="text-3xl mb-2"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {item.icon}
              </motion.span>
              <span className="font-medium text-gray-900">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default StudentDashboard