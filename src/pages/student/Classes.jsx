// src/pages/student/Classes.jsx - UPDATED
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { classAPI } from '../../services/api'

const StudentClasses = () => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [classes, setClasses] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [recordedClasses, setRecordedClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchClasses()
    }
  }, [user])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      
      // Get all classes
      const response = await classAPI.getClasses()
      if (response.data.success) {
        const allClasses = response.data.classes || []
        setClasses(allClasses)
        
        // Filter upcoming classes
        const now = new Date()
        const upcoming = allClasses.filter(cls => 
          new Date(cls.startTime) > now && cls.status === 'scheduled'
        )
        setUpcomingClasses(upcoming)
        
        // Filter recorded/completed classes
        const recorded = allClasses.filter(cls => 
          cls.status === 'completed' && cls.recordingLink
        )
        setRecordedClasses(recorded)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = async (classItem) => {
    try {
      await classAPI.joinClass(classItem._id)
      window.open(classItem.meetingLink, '_blank')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join class')
    }
  }

  // Format functions
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Online Classes</h1>
        <p className="text-gray-600 mt-2">
          Access all scheduled classes and recordings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - All Classes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Classes</h2>
              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field py-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              {classes.map((classItem) => {
                const now = new Date()
                const startTime = new Date(classItem.startTime)
                const isLive = startTime <= now && 
                              new Date(classItem.endTime) >= now &&
                              classItem.status === 'live'
                const isUpcoming = startTime > now
                const isCompleted = classItem.status === 'completed'
                
                return (
                  <div key={classItem._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className={`h-3 w-3 rounded-full mr-2 ${
                            isCompleted ? 'bg-green-500' :
                            isLive ? 'bg-red-500 animate-pulse' :
                            'bg-blue-500'
                          }`}></span>
                          <span className="text-sm font-medium text-gray-500 uppercase">
                            {isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'COMPLETED'}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{classItem.subject}</h3>
                        <p className="text-gray-700 mt-1">{classItem.topic}</p>
                        <div className="flex items-center mt-3 text-sm text-gray-600">
                          <span className="mr-4">👨‍🏫 {classItem.instructorName}</span>
                          <span>🕐 {formatDateTime(classItem.startTime)}</span>
                        </div>
                      </div>
                      <div>
                        {isLive ? (
                          <button 
                            onClick={() => handleJoinClass(classItem)}
                            className="btn-primary"
                          >
                            Join Now
                          </button>
                        ) : isUpcoming ? (
                          <button className="btn-secondary">
                            Starts at {formatTime(classItem.startTime)}
                          </button>
                        ) : (
                          <button className="btn-secondary">
                            {classItem.recordingLink ? 'Watch Recording' : 'Completed'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Classes</span>
                <span className="font-bold text-blue-600">{classes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Upcoming</span>
                <span className="font-bold text-yellow-600">{upcomingClasses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Recordings</span>
                <span className="font-bold text-purple-600">{recordedClasses.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {upcomingClasses.length > 0 && (
                <button 
                  onClick={() => handleJoinClass(upcomingClasses[0])}
                  className="w-full btn-primary py-3"
                >
                  🎥 Join Next Class
                </button>
              )}
              <button className="w-full btn-secondary py-3">
                📚 Study Material
              </button>
              <button className="w-full btn-secondary py-3">
                ❓ Ask Doubt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentClasses