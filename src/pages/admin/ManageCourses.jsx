// src/pages/admin/ManageCourses.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { courseAPI, classAPI } from '../../services/api'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

const ManageCourses = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])

  // Simulate loading for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Available classes and courses for selection
  const availableOptions = [
    { id: "class1", name: "Class 1", type: "class", category: "School" },
    { id: "class2", name: "Class 2", type: "class", category: "School" },
    { id: "class3", name: "Class 3", type: "class", category: "School" },
    { id: "class4", name: "Class 4", type: "class", category: "School" },
    { id: "class5", name: "Class 5", type: "class", category: "School" },
    { id: "class6", name: "Class 6", type: "class", category: "School" },
    { id: "class7", name: "Class 7", type: "class", category: "School" },
    { id: "class8", name: "Class 8", type: "class", category: "School" },
    { id: "class9", name: "Class 9", type: "class", category: "School" },
    { id: "class10", name: "Class 10", type: "class", category: "School" },
    { id: "class11_science", name: "Class 11 (Science)", type: "class", category: "Science" },
    { id: "class12_science", name: "Class 12 (Science)", type: "class", category: "Science" },
    { id: "class11_commerce", name: "Class 11 (Commerce)", type: "class", category: "Commerce" },
    { id: "class12_commerce", name: "Class 12 (Commerce)", type: "class", category: "Commerce" },
    { id: "jee_prep", name: "JEE Preparation", type: "course", category: "Engineering" },
    { id: "neet_prep", name: "NEET Preparation", type: "course", category: "Medical" },
    { id: "upsc_foundation", name: "UPSC Foundation", type: "course", category: "Civil Services" },
    { id: "math_course", name: "Mathematics", type: "course", category: "All Classes" },
    { id: "physics_course", name: "Physics", type: "course", category: "All Classes" },
    { id: "chemistry_course", name: "Chemistry", type: "course", category: "All Classes" },
    { id: "biology_course", name: "Biology", type: "course", category: "All Classes" },
    { id: "english_course", name: "English", type: "course", category: "All Classes" },
    { id: "social_science_course", name: "Social Science", type: "course", category: "All Classes" },
    { id: "computer_course", name: "Computer Science", type: "course", category: "All Classes" },
  ];

  // Mock Instructor Names (Select Option)
  const instructorOptions = [
    { id: 1, name: "Dr. Ravi Sharma" },
    { id: 2, name: "Prof. Anjali Singh" },
    { id: 3, name: "Dr. Vikram Mehta" },
    { id: 4, name: "Ms. Priya Gupta" },
  ];

  // Time Duration Options
  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "60 minutes" },
    { value: 90, label: "90 minutes" },
    { value: 120, label: "120 minutes" },
  ];

  const [newCourse, setNewCourse] = useState({
    selectedOption: '',
    name: '',
    description: '',
    instructor: '',
    instructorName: '',
    status: 'active',
    meetingLink: '',
    startTime: '',
    duration: 60,
    topic: '',
    meetingPlatform: 'google_meet'
  })

  // Fetch courses and upcoming classes
  useEffect(() => {
    fetchCourses()
    fetchUpcomingClasses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getAllCourses()
      if (response.data.success) {
        setCourses(response.data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingClasses = async () => {
    try {
      const response = await classAPI.getUpcomingClasses()
      if (response.data.success) {
        setUpcomingClasses(response.data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching upcoming classes:', error)
    }
  }

  const handleAddCourse = async () => {
    console.log('🔍 handleAddCourse called');
    console.log('Topic value:', newCourse.topic);
    
    if (!newCourse.selectedOption) {
      alert('Please select a class or course');
      return;
    }

    if (!newCourse.topic || newCourse.topic.trim() === '') {
      alert('Please enter class topic');
      return;
    }

    if (!newCourse.startTime) {
      alert('Please select start time');
      return;
    }

    if (!newCourse.meetingLink) {
      alert('Please provide meeting link');
      return;
    }

    try {
      setLoading(true);
      
      const selectedOption = availableOptions.find(opt => opt.id === newCourse.selectedOption);
      
      const classData = {
        title: selectedOption ? selectedOption.name : newCourse.name,
        description: newCourse.description || `Class for ${selectedOption?.name || 'New Class'}`,
        category: selectedOption ? selectedOption.category : 'General',
        subject: selectedOption ? selectedOption.name : newCourse.name,
        topic: newCourse.topic.trim(),
        startTime: newCourse.startTime,
        duration: newCourse.duration,
        meetingLink: newCourse.meetingLink,
        meetingPlatform: newCourse.meetingPlatform,
        instructorName: newCourse.instructorName,
        instructorId: currentUser._id,
        targetAudience: ['all'],
        visibility: 'all_students'
      };
      
      console.log('📤 Sending class data:', classData);
      
      const response = await classAPI.createClass(classData);
      
      console.log('✅ Response:', response.data);
      
      if (response.data.success) {
        alert('✅ Class scheduled successfully! All students can now see this class.');
        
        setShowAddModal(false);
        resetNewCourseForm();
        
        // Refresh both
        await Promise.all([
          fetchCourses(),
          fetchUpcomingClasses()
        ]);
      }
      
    } catch (error) {
      console.error('❌ Error scheduling class:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.response?.status === 404) {
        alert('❌ Class API not found! Please make sure:\n1. Backend server is running\n2. Class routes are added\n3. Server is restarted');
      } else {
        alert('Failed to schedule class. Please check console.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW FUNCTION: Delete Class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? This will remove it from student dashboards as well.')) {
      return;
    }

    try {
      // First, remove from upcoming classes in state
      setUpcomingClasses(prev => prev.filter(cls => cls._id !== classId));
      
      // Try to delete from backend
      try {
        await classAPI.deleteClass(classId);
        console.log('✅ Class deleted from backend');
      } catch (backendError) {
        console.warn('⚠️ Backend delete failed, but removed from local state:', backendError.message);
      }
      
      // Also remove from localStorage if exists
      const storedClasses = JSON.parse(localStorage.getItem('scheduledClasses') || '[]');
      const updatedClasses = storedClasses.filter(cls => cls._id !== classId);
      localStorage.setItem('scheduledClasses', JSON.stringify(updatedClasses));
      
      alert('✅ Class deleted successfully! It will no longer appear in student dashboards.');
      
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class. Please try again.');
    }
  };

  const handleEditCourse = async () => {
    try {
      setLoading(true)
      
      const courseData = {
        name: newCourse.name,
        instructor: newCourse.instructorName,
        description: newCourse.description,
        status: newCourse.status
      }

      const response = await courseAPI.updateCourse(selectedCourse._id, courseData)
      
      if (response.data.success) {
        alert('Course updated successfully!')
        setShowEditModal(false)
        fetchCourses()
      }
    } catch (error) {
      console.error('Error updating course:', error)
      alert(error.response?.data?.message || 'Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await courseAPI.deleteCourse(id)
        if (response.data.success) {
          alert('Course deleted successfully!')
          fetchCourses()
        }
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Failed to delete course')
      }
    }
  }

  const resetNewCourseForm = () => {
    setNewCourse({
      selectedOption: '',
      name: '',
      description: '',
      instructor: '',
      instructorName: '',
      status: 'active',
      meetingLink: '',
      startTime: '',
      duration: 60,
      topic: '',
      meetingPlatform: 'google_meet'
    })
  }

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.status === activeTab)

  const categories = ['All', 'Active', 'Inactive', 'Engineering', 'Medical', 'School', 'Commerce', 'Science', 'Civil Services']

  // Format time for display
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'hh:mm a')
    } catch (error) {
      return 'Invalid time'
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'dd MMM yyyy')
    } catch (error) {
      return 'Invalid date'
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
            Loading Courses...
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            Preparing your management dashboard
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-red-50">
      {/* Header with Animation */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 via-purple-600 to-purple-900 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage Courses & Classes
        </motion.h1>
        <motion.p 
          className="text-gray-600 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Create, edit, and manage all classes and courses offered by the institute.
        </motion.p>
      </motion.div>

      {/* Stats with Animation */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div 
          className="card bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:border-purple-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#7c3aed"
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <motion.p 
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mt-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#ef4444", "#7c3aed", "#4c1d95"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {courses.length}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 rounded-full bg-gradient-to-r from-red-100 to-purple-100 text-red-600"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <span className="text-2xl">📚</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:border-purple-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#7c3aed"
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <motion.p 
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mt-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#ef4444", "#7c3aed", "#4c1d95"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 rounded-full bg-gradient-to-r from-red-100 to-purple-100 text-purple-600"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <span className="text-2xl">👨‍🎓</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:border-purple-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.0, type: "spring" }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#7c3aed"
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Classes</p>
              <motion.p 
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mt-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#ef4444", "#7c3aed", "#4c1d95"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                {upcomingClasses.length}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 rounded-full bg-gradient-to-r from-red-100 to-purple-100 text-red-600"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity }
              }}
            >
              <span className="text-2xl">📅</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:border-purple-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, type: "spring" }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
            borderColor: "#7c3aed"
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Instructors</p>
              <motion.p 
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mt-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#ef4444", "#7c3aed", "#4c1d95"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                {instructorOptions.length}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 rounded-full bg-gradient-to-r from-red-100 to-purple-100 text-purple-600"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <span className="text-2xl">👨‍🏫</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Upcoming Classes Section with Animation */}
      <AnimatePresence>
        {upcomingClasses.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-red-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2 
                className="text-xl font-bold text-gray-900 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="mr-2"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  📅
                </motion.span>
                Upcoming Classes
              </motion.h2>
              <motion.button
                onClick={fetchUpcomingClasses}
                className="text-red-600 hover:text-purple-700 text-sm font-medium flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  🔄
                </motion.span>
                Refresh
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingClasses.slice(0, 4).map((classItem, index) => (
                <motion.div 
                  key={classItem._id} 
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow relative overflow-hidden bg-gradient-to-br from-white to-red-50"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 15px 30px rgba(239, 68, 68, 0.1)",
                    borderColor: "#ef4444"
                  }}
                >
                  {/* Animated Background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  />
                  
                  {/* ✅ DELETE BUTTON - Top Right Corner */}
                  <motion.button
                    onClick={() => handleDeleteClass(classItem._id)}
                    className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-lg hover:shadow-xl border border-red-100"
                    title="Delete Class"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <motion.span 
                        className="text-xs font-medium text-white bg-gradient-to-r from-red-600 to-purple-600 px-3 py-1 rounded-full inline-block"
                        whileHover={{ scale: 1.1 }}
                      >
                        {classItem.className || classItem.subject}
                      </motion.span>
                      <h4 className="font-bold text-gray-900 mt-2 text-lg">{classItem.subject}</h4>
                      <motion.p 
                        className="text-sm text-gray-600 mt-1"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {classItem.topic}
                      </motion.p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm relative z-10">
                    <motion.div 
                      className="flex items-center text-gray-600"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                      >
                        👨‍🏫
                      </motion.span>
                      <span>{classItem.instructorName}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center text-gray-600"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 4, repeat: Infinity, delay: index * 0.2 },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        ⏰
                      </motion.span>
                      <span>
                        {formatDate(classItem.startTime)} • {formatTime(classItem.startTime)}
                      </span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center text-gray-600"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={{ 
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⏱️
                      </motion.span>
                      <span>{classItem.duration} minutes</span>
                    </motion.div>
                    {classItem.meetingLink && (
                      <motion.div 
                        className="pt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.a 
                          href={classItem.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white text-sm font-medium flex items-center bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 px-3 py-2 rounded-lg transition-all duration-300 w-fit"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 5px 15px rgba(239, 68, 68, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span 
                            className="mr-2"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🔗
                          </motion.span>
                          Join Live Class
                        </motion.a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls with Animation */}
      <motion.div 
        className="card bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 mb-6 shadow-lg border border-red-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        whileHover={{ 
          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444"
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveTab(category.toLowerCase())}
                className={`px-4 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center ${
                  activeTab === category.toLowerCase()
                    ? 'bg-gradient-to-r from-red-600 to-purple-900 text-white shadow-lg shadow-purple-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
              >
                {category}
                {activeTab === category.toLowerCase() && (
                  <motion.span 
                    className="ml-2 text-xs opacity-90"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ({category === 'All' ? courses.length : filteredCourses.length})
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, type: "spring" }}
          >
            <motion.button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group relative"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="relative z-10 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span 
                  className="mr-2"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ➕
                </motion.span>
                Add New Course & Schedule Class
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-800"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Courses Table with Animation */}
      <motion.div 
        className="card bg-gradient-to-b from-white to-red-50 rounded-2xl p-6 shadow-lg border border-red-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        whileHover={{ 
          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.1)"
        }}
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-6"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-purple-600 rounded-full"></div>
              </motion.div>
            </div>
            <motion.p 
              className="text-gray-600"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading courses...
            </motion.p>
          </div>
        ) : courses.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="text-5xl mb-4"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity }
              }}
            >
              📚
            </motion.div>
            <motion.h3 
              className="text-xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No Courses Found
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Add your first course to get started
            </motion.p>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group relative"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="relative z-10">Add First Course</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-800"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course/Class</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course, index) => (
                    <motion.tr 
                      key={course._id} 
                      className="hover:bg-red-50/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 + index * 0.05 }}
                      whileHover={{ 
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                        scale: 1.005
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <motion.div 
                            className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-100 to-purple-100 flex items-center justify-center mr-3"
                            whileHover={{ 
                              rotateY: 180,
                              scale: 1.1
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.span 
                              className="text-red-600"
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                            >
                              {course.classType === 'course' ? '🎓' : '📚'}
                            </motion.span>
                          </motion.div>
                          <div>
                            <div className="font-medium text-gray-900">{course.name}</div>
                            {course.description && (
                              <motion.div 
                                className="text-sm text-gray-500 truncate max-w-xs"
                                initial={{ opacity: 0.7 }}
                                whileHover={{ opacity: 1 }}
                              >
                                {course.description}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          className="px-3 py-1 bg-gradient-to-r from-red-50 to-purple-50 text-red-800 rounded-full text-sm border border-red-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          {course.category}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium flex items-center">
                          <motion.span 
                            className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent"
                            animate={{ 
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                          >
                            {course.totalStudents || 0}
                          </motion.span>
                          <span className="text-gray-400 ml-1">students</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium flex items-center">
                          <motion.span 
                            className="mr-2"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            👨‍🏫
                          </motion.span>
                          {course.instructor || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.status === 'active'
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            boxShadow: course.status === 'active' 
                              ? ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 8px rgba(34, 197, 94, 0.1)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                              : "none"
                          }}
                          transition={{ 
                            boxShadow: { duration: 2, repeat: Infinity }
                          }}
                        >
                          {course.status?.charAt(0).toUpperCase() + course.status?.slice(1) || 'Active'}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={() => {
                              setSelectedCourse(course)
                              setNewCourse({
                                selectedOption: '',
                                name: course.name,
                                description: course.description || '',
                                instructor: course.instructor || '',
                                instructorName: course.instructor || '',
                                status: course.status || 'active'
                              })
                              setShowEditModal(true)
                            }}
                            className="text-red-600 hover:text-purple-700 text-sm font-medium flex items-center"
                            whileHover={{ scale: 1.1, x: 3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.span 
                              className="mr-1"
                              animate={{ 
                                rotateY: [0, 180],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                rotateY: { duration: 2, repeat: Infinity },
                                scale: { duration: 2, repeat: Infinity }
                              }}
                            >
                              ✏️
                            </motion.span>
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                            whileHover={{ scale: 1.1, x: 3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.span 
                              className="mr-1"
                              animate={{ 
                                scale: [1, 1.3, 1],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              🗑️
                            </motion.span>
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <motion.div 
              className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
            >
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">1</span> to{' '}
                <span className="font-medium bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">{filteredCourses.length}</span> of{' '}
                <span className="font-medium bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">{courses.length}</span> courses
              </div>
              <div className="flex space-x-2">
                <motion.button
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Add Course Modal with Animation */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-red-100"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Add New Course & Schedule Class
                  </motion.h2>
                  <motion.button
                    onClick={() => {
                      setShowAddModal(false)
                      resetNewCourseForm()
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Classes and Courses Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class or Course *
                    </label>
                    <motion.select
                      value={newCourse.selectedOption}
                      onChange={(e) => {
                        const selectedOption = availableOptions.find(opt => opt.id === e.target.value)
                        setNewCourse({
                          ...newCourse,
                          selectedOption: e.target.value,
                          name: selectedOption ? selectedOption.name : '',
                          topic: '' // Always empty when selecting
                        })
                      }}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Select Class or Course</option>
                      
                      {/* Classes Section */}
                      <optgroup label="📚 Classes">
                        {availableOptions
                          .filter(opt => opt.type === 'class')
                          .map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                      </optgroup>
                      
                      {/* Courses Section */}
                      <optgroup label="🎓 Courses">
                        {availableOptions
                          .filter(opt => opt.type === 'course')
                          .map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                      </optgroup>
                    </motion.select>
                  </motion.div>

                  {/* Class Topic */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Topic *
                    </label>
                    <motion.input
                      type="text"
                      value={newCourse.topic}
                      onChange={(e) => setNewCourse({...newCourse, topic: e.target.value})}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      placeholder="e.g., Calculus - Sets and Functions, Algebra Basics, Physics - Motion, etc."
                      whileFocus={{ scale: 1.01 }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter specific topic for this class. This will be shown to students.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Instructor Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor Name *
                      </label>
                      <motion.select
                        value={newCourse.instructorName}
                        onChange={(e) => setNewCourse({...newCourse, instructorName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      >
                        <option value="">Select Instructor</option>
                        {instructorOptions.map((instructor) => (
                          <option key={instructor.id} value={instructor.name}>
                            {instructor.name}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </motion.select>
                    </motion.div>

                    {/* Start Time */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class Start Time *
                      </label>
                      <motion.input
                        type="datetime-local"
                        value={newCourse.startTime}
                        onChange={(e) => setNewCourse({...newCourse, startTime: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      />
                    </motion.div>

                    {/* Duration */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <motion.select
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value)})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      >
                        {durationOptions.map((duration) => (
                          <option key={duration.value} value={duration.value}>
                            {duration.label}
                          </option>
                        ))}
                      </motion.select>
                    </motion.div>

                    {/* Meeting Platform */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Platform *
                      </label>
                      <motion.select
                        value={newCourse.meetingPlatform}
                        onChange={(e) => setNewCourse({...newCourse, meetingPlatform: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      >
                        <option value="google_meet">Google Meet</option>
                        <option value="zoom">Zoom</option>
                        <option value="microsoft_teams">Microsoft Teams</option>
                      </motion.select>
                    </motion.div>
                  </div>

                  {/* Live Meeting Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Live Meeting Link *
                    </label>
                    <div className="flex items-center">
                      <motion.span 
                        className="mr-2 text-gray-500"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔗
                      </motion.span>
                      <motion.input
                        type="url"
                        value={newCourse.meetingLink}
                        onChange={(e) => setNewCourse({...newCourse, meetingLink: e.target.value})}
                        required
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        whileFocus={{ scale: 1.01 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Students will use this link to join the live class
                    </p>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <motion.textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      rows={4}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none"
                      placeholder="Enter course/class description, learning objectives, etc."
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <motion.select
                      value={newCourse.status}
                      onChange={(e) => setNewCourse({...newCourse, status: e.target.value})}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </motion.select>
                  </motion.div>

                  {/* Important Note */}
                  <motion.div 
                    className="bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex items-start">
                      <motion.span 
                        className="text-red-600 mr-2"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💡
                      </motion.span>
                      <div>
                        <p className="text-sm text-red-800 font-medium">Important Note</p>
                        <p className="text-xs text-red-600 mt-1">
                          When you click "Add Course", a new course will be created and a class will be scheduled automatically. 
                          The class will appear in the "Upcoming Classes" section above with the live meeting link.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        resetNewCourseForm()
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300"
                      whileHover={{ scale: 1.05, borderColor: "#ef4444" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleAddCourse}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-800 text-white rounded-xl font-medium disabled:opacity-50 flex items-center transition-all duration-300 relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <>
                          <motion.div 
                            className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <motion.span 
                            className="mr-2"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            📅
                          </motion.span>
                          Schedule Class
                        </>
                      )}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-800"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Course Modal with Animation */}
      <AnimatePresence>
        {showEditModal && selectedCourse && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-red-100"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Edit Course
                  </motion.h2>
                  <motion.button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <motion.input
                        type="text"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor *
                      </label>
                      <motion.select
                        value={newCourse.instructorName}
                        onChange={(e) => setNewCourse({...newCourse, instructorName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        whileFocus={{ scale: 1.01 }}
                      >
                        <option value="">Select Instructor</option>
                        {instructorOptions.map((instructor) => (
                          <option key={instructor.id} value={instructor.name}>
                            {instructor.name}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </motion.select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <motion.textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <motion.select
                      value={newCourse.status}
                      onChange={(e) => setNewCourse({...newCourse, status: e.target.value})}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </motion.select>
                  </motion.div>

                  <motion.div 
                    className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300"
                      whileHover={{ scale: 1.05, borderColor: "#ef4444" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleEditCourse}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-900 hover:from-red-700 hover:to-purple-800 text-white rounded-xl font-medium disabled:opacity-50 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <>
                          <motion.div 
                            className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Updating...
                        </>
                      ) : (
                        'Update Course'
                      )}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-800"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Animation */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 3, type: "spring" }}
      >
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-red-600 to-purple-900 text-white rounded-full p-4 shadow-2xl border border-red-200 hover:border-purple-600 transition-colors duration-300 flex items-center justify-center"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 15px 40px rgba(239, 68, 68, 0.4)",
            rotate: 90
          }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div 
            className="text-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ➕
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Floating Stats Card */}
      <motion.div
        className="fixed bottom-8 left-8 z-40 hidden lg:block"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.2, type: "spring" }}
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
              📊
            </motion.div>
            <div className="text-right">
              <div className="font-bold bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-transparent">
                {courses.length} Courses
              </div>
              <div className="text-sm text-gray-600">{upcomingClasses.length} upcoming</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ManageCourses