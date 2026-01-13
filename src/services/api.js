import axios from 'axios';

const API_URL = 'https://event-backend-brown.vercel.app';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= AUTH APIs =================
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.get('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  updateDetails: (data) => api.put('/api/auth/updatedetails', data),
  updatePassword: (data) => api.put('/api/auth/updatepassword', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

// ================= USER APIs =================
export const userAPI = {
  getAllStudents: () => api.get('/api/users/students'),
  getStudent: (id) => api.get(`/api/users/students/${id}`),
  updateStudent: (id, data) => api.put(`/api/users/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/api/users/students/${id}`),
  
  registerStudent: (data) => {
    return api.post('/api/users/register-student', data)
  },
  
  sendCredentials: (studentId) => api.post(`/api/users/send-credentials/${studentId}`),
  sendMessage: (studentId, message) => api.post(`/api/users/send-message/${studentId}`, { message }),
  markCourseCompleted: (studentId) => api.put(`/api/users/mark-completed/${studentId}`),
  getStudentPayments: (studentId) => api.get(`/api/users/${studentId}/payments`),
  
  exportStudentsCSV: (params) => api.get('/api/users/export/students', { 
    params,
    responseType: 'blob'
  }),
  
  deactivateStudent: (studentId) => api.put(`/api/users/students/${studentId}`, { status: 'inactive' }),
  activateStudent: (studentId) => api.put(`/api/users/students/${studentId}`, { status: 'active' }),
  
  searchStudents: (params) => api.get('/api/users/students/search', { params }),
  getInstructors: () => api.get('/api/users/instructors'),
  getAllUsers: () => api.get('/api/users'),
};

// ================= COURSE APIs =================
export const courseAPI = {
  getAllCourses: () => api.get('/api/courses'),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (data) => api.post('/api/courses', data),
  updateCourse: (id, data) => api.put(`/api/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
  enrollCourse: (courseId) => api.post(`/api/courses/${courseId}/enroll`),
};

// ================= CLASS APIs =================
export const classAPI = {
  createClass: (data) => api.post('/api/classes', data),
  getClasses: (params) => api.get('/api/classes', { params }),
  getUpcomingClasses: () => api.get('/api/classes/upcoming'),
  getLiveClasses: () => api.get('/api/classes/live'),
  joinClass: (classId) => api.post(`/api/classes/${classId}/join`),
  deleteClass: (classId) => api.delete(`/api/classes/${classId}`),
  getClass: (id) => api.get(`/api/classes/${id}`),
};

// ================= NOTICE APIs =================
export const noticeAPI = {
  createNotice: (data) => api.post('/api/notices', data),
  getAllNotices: (params) => api.get('/api/notices', { params }),
  updateNotice: (id, data) => api.put(`/api/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/api/notices/${id}`),
  getNoticeStats: () => api.get('/api/notices/stats/overview'),
  
  getStudentNotices: (params) => api.get('/api/notices/student', { params }),
  markNoticeAsRead: (noticeId) => api.post(`/api/notices/${noticeId}/read`),
  getUnreadCount: () => api.get('/api/notices/student/unread-count'),
  getNoticeById: (id) => api.get(`/api/notices/${id}`)
};

// ================= PAYMENT APIs =================
export const paymentAPI = {
  createOrder: async (data) => {
    return api.post('/api/payments/create-order', data);
  },

  verifyPayment: async (data) => {
    return api.post('/api/payments/verify', data);
  },

  getAllPayments: (params) => {
    return api.get('/api/payments', { params });
  },

  getStudentPayments: () => api.get('/api/payments/student'),
  
  downloadInvoice: (paymentId) => api.get(`/api/payments/${paymentId}/invoice`, { 
    responseType: 'blob' 
  }),
  
  checkPaymentStatus: (orderId) => api.get(`/api/payments/status/${orderId}`),
  
  handleFailedPayment: (data) => api.post('/api/payments/failed', data),

  initiateRefund: (paymentId, data) => api.post(`/api/payments/${paymentId}/refund`, data),

  getPaymentStats: () => api.get('/api/payments/stats/overview'),
};

export default api;