import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('register')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parentPhone: '',
    class: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchAllStudents()
  }, [])

  const fetchAllStudents = async () => {
    try {
      setPageLoading(true)
      // Simulate loading for animation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const response = await userAPI.getAllStudents()
      if (response.data.success) {
        setStudents(response.data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setPageLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleRegisterStudent = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Name, email, and phone are required!')
      return
    }

    try {
      setLoading(true)
      
      const enrollmentId = `ENR${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`
      
      const studentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        parentPhone: formData.parentPhone,
        class: formData.class,
        address: formData.address,
        enrollmentDate: formData.enrollmentDate,
        enrollmentId: enrollmentId,
        role: 'student',
        status: 'active'
      }

      console.log('📤 Sending student data to backend:', studentData)
      const response = await userAPI.registerStudent(studentData)
      console.log('✅ Backend response:', response.data)
      
      if (response.data.success) {
        alert(`✅ Student registered successfully!\n\nEnrollment ID: ${enrollmentId}\nEmail: ${formData.email}\nPassword: welcome123`)
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          parentPhone: '',
          class: '',
          address: '',
          enrollmentDate: new Date().toISOString().split('T')[0]
        })
        
        fetchAllStudents()
        setActiveTab('students')
      } else {
        alert(`❌ Registration failed: ${response.data.message}`)
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error)
      
      if (error.response?.data?.message) {
        alert(`❌ Error: ${error.response.data.message}`)
      } else if (error.response?.data?.error) {
        alert(`❌ Error: ${error.response.data.error}`)
      } else {
        alert('❌ Failed to register student. Please try again.')
      }
      
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }

    try {
      const response = await userAPI.deleteStudent(studentId)
      if (response.data.success) {
        alert('Student deleted successfully')
        fetchAllStudents()
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete student')
    }
  }

  const handleSendCredentials = (student) => {
    const credentials = `
Student Credentials:
-------------------
Name: ${student.name}
Enrollment ID: ${student.enrollmentId}
Email: ${student.email}
Password: welcome123
Login URL: http://localhost:5173/login

Instructions:
1. Use Enrollment ID or Email to login
2. First time password: welcome123
3. Change password after first login
    `
    
    navigator.clipboard.writeText(credentials)
      .then(() => {
        alert('Credentials copied to clipboard!')
      })
      .catch(err => {
        console.error('Copy failed:', err)
        alert('Please copy manually:\n' + credentials)
      })
  }

  const classOptions = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 (Science)', 'Class 12 (Science)',
    'Class 11 (Commerce)', 'Class 12 (Commerce)',
    'JEE Preparation', 'NEET Preparation', 'UPSC Foundation'
  ]

  // Page Loading Animation
  if (pageLoading) {
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
            Loading Admin Dashboard...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Preparing management console
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-red-50">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Welcome, {currentUser?.name || 'Admin'}. Manage student registrations and institute operations.
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Student Registration & Management */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <motion.div 
            className="flex border-b border-gray-200 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-3 font-medium text-sm relative ${
                activeTab === 'register' 
                  ? 'text-red-600' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 Register New Student
              {activeTab === 'register' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-900"
                  layoutId="adminActiveTab"
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 font-medium text-sm relative ${
                activeTab === 'students' 
                  ? 'text-red-600' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👨‍🎓 All Students ({students.length})
              {activeTab === 'students' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-900"
                  layoutId="adminActiveTab"
                />
              )}
            </motion.button>
          </motion.div>

          {/* Registration Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'register' && (
              <motion.div 
                className="bg-gradient-to-br from-white to-red-50 border border-gray-100 rounded-xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2 
                  className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Register New Student
                </motion.h2>
                
                <form onSubmit={handleRegisterStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'name', label: 'Full Name *', type: 'text', placeholder: "Enter student's full name" },
                      { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'student@example.com' },
                      { name: 'phone', label: 'Student\'s Phone *', type: 'tel', placeholder: '9876543210' },
                      { name: 'parentPhone', label: 'Parent\'s Phone *', type: 'tel', placeholder: '9876543210' },
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 hover:border-red-300"
                          placeholder={field.placeholder}
                        />
                      </motion.div>
                    ))}

                    {/* Class */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class *
                      </label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-300"
                      >
                        <option value="">Select Class</option>
                        {classOptions.map((cls, index) => (
                          <option key={index} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Enrollment Date */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enrollment Date *
                      </label>
                      <input
                        type="date"
                        name="enrollmentDate"
                        value={formData.enrollmentDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 hover:border-red-300"
                      />
                    </motion.div>

                    {/* Address - Full Width */}
                    <motion.div 
                      className="md:col-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 hover:border-red-300"
                        placeholder="Full residential address"
                      />
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        {loading ? (
                          <>
                            <motion.svg 
                              className="animate-spin h-5 w-5 mr-3 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </motion.svg>
                            Registering Student...
                          </>
                        ) : (
                          'Register Student'
                        )}
                      </span>
                    </motion.button>
                  </motion.div>

                  {/* Note */}
                  <motion.div 
                    className="mt-4 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p>✅ Default password will be: <strong>welcome123</strong></p>
                    <p>✅ Enrollment ID will be automatically generated</p>
                    <p>✅ Student will receive login credentials</p>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* All Students List */}
            {activeTab === 'students' && (
              <motion.div 
                className="bg-gradient-to-br from-white to-purple-50 border border-gray-100 rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    All Students ({students.length})
                  </motion.h2>
                  <motion.button
                    onClick={() => setActiveTab('register')}
                    className="bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white px-4 py-2 rounded-lg font-medium relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">+</span>
                      Add New Student
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {loading ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-gray-600 mt-4">Loading students...</p>
                    </motion.div>
                  ) : students.length === 0 ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="text-4xl mb-4"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        👨‍🎓
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h3>
                      <p className="text-gray-600">Register your first student to get started</p>
                      <motion.button
                        onClick={() => setActiveTab('register')}
                        className="mt-4 bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white px-6 py-3 rounded-lg font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        Register First Student
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-red-50 to-purple-50">
                          <tr>
                            {['Student Info', 'Contact', 'Class', 'Status', 'Actions'].map((header, index) => (
                              <motion.th 
                                key={header}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                              >
                                {header}
                              </motion.th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student, index) => (
                            <motion.tr 
                              key={student._id} 
                              className="hover:bg-red-50 transition-colors duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-500 font-mono">
                                    ID: {student.enrollmentId || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Joined: {new Date(student.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm text-gray-900">{student.email}</div>
                                  <div className="text-sm text-gray-500">{student.phone}</div>
                                  <div className="text-xs text-gray-400">
                                    Parent: {student.parentPhone}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-purple-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                                  {student.class || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <motion.span 
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    student.status === 'active' 
                                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                                      : student.status === 'inactive'
                                      ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
                                      : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {student.status || 'active'}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <motion.button
                                    onClick={() => handleSendCredentials(student)}
                                    className="text-blue-600 hover:text-blue-800 text-lg"
                                    title="Send Credentials"
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    🔑
                                  </motion.button>
                                  <Link
                                    to={`/admin/students/${student._id}`}
                                    className="text-green-600 hover:text-green-800 text-lg"
                                    title="Edit"
                                  >
                                    ✏️
                                  </Link>
                                  <motion.button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="text-red-600 hover:text-red-800 text-lg"
                                    title="Delete"
                                    whileHover={{ scale: 1.2 }}
                                  >
                                    🗑️
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Stats */}
                {students.length > 0 && (
                  <motion.div 
                    className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      { label: 'Total Students', value: students.length, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-600' },
                      { label: 'Active', value: students.filter(s => s.status === 'active').length, color: 'from-green-50 to-green-100', textColor: 'text-green-600' },
                      { label: 'This Month', value: students.filter(s => {
                        const joinDate = new Date(s.createdAt)
                        const now = new Date()
                        return joinDate.getMonth() === now.getMonth() && 
                               joinDate.getFullYear() === now.getFullYear()
                      }).length, color: 'from-purple-50 to-purple-100', textColor: 'text-purple-600' },
                      { label: 'Classes', value: new Set(students.map(s => s.class)).size, color: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-600' }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        className={`bg-gradient-to-r ${stat.color} p-4 rounded-lg border border-gray-200`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className={`text-sm ${stat.textColor}`}>{stat.label}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          {/* Quick Actions */}
          <motion.div 
            className="bg-gradient-to-br from-white to-red-50 border border-gray-100 rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.h2 
              className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Quick Actions
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { to: '/admin/courses', icon: '🎥', label: 'Class Control' },
                { to: '/admin/students', icon: '👨‍🎓', label: 'Manage Students' },
                { to: '/admin/payments', icon: '💰', label: 'Payment Records' },
                { to: '/admin/notices', icon: '📢', label: 'Notices' }
              ].map((action, index) => (
                <motion.div
                  key={action.to}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Link 
                    to={action.to} 
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-300 group"
                  >
                    <motion.span 
                      className="text-3xl mb-2"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {action.icon}
                    </motion.span>
                    <span className="font-medium text-center text-gray-900 group-hover:text-red-600">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Registration Stats */}
          <motion.div 
            className="bg-gradient-to-br from-white to-purple-50 border border-gray-100 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.h2 
              className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              Registration Stats
            </motion.h2>
            <div className="space-y-4">
              {[
                { icon: '👥', label: 'Total Students', sublabel: 'All time registrations', value: students.length, color: 'blue' },
                { icon: '📈', label: 'This Month', sublabel: 'New registrations', value: students.filter(s => {
                  const joinDate = new Date(s.createdAt)
                  const now = new Date()
                  return joinDate.getMonth() === now.getMonth() && 
                         joinDate.getFullYear() === now.getFullYear()
                }).length, color: 'green' },
                { icon: '🎓', label: 'Active Classes', sublabel: 'Different classes', value: new Set(students.map(s => s.class)).size, color: 'purple' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center mr-3`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className={`text-${stat.color}-600`}>{stat.icon}</span>
                    </motion.div>
                    <div>
                      <div className="font-medium">{stat.label}</div>
                      <div className="text-sm text-gray-500">{stat.sublabel}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </motion.div>
              ))}

              <motion.div 
                className="pt-4 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.button
                  onClick={() => setActiveTab('register')}
                  className="w-full bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-950 text-white font-bold py-3 rounded-lg transition-all relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">+</span>
                    Register New Student
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 to-red-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard