import { config } from '../config/env.js';

const API_BASE_URL = config.API_BASE_URL || 'http://localhost:5000/api';
let authToken = null;

// Initialize auth token from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authToken = token;
  }
};

// Call initialization
initializeAuth();

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    },
    ...options,
  };

  // Add debugging
  console.log('Making API request to:', url);
  console.log('Request options:', defaultOptions);

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let message = `HTTP error! status: ${response.status}`;
      if (errorData) {
        const backendMsg = errorData.message || errorData.error;
        const details = Array.isArray(errorData.details)
          ? errorData.details.map(d => d.msg || d).join('; ')
          : (typeof errorData.details === 'string' ? errorData.details : undefined);
        message = [backendMsg, details].filter(Boolean).join(' - ') || message;
      }
      const error = new Error(message);
      error.response = response;
      error.data = errorData;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', {
      url,
      error: error.message,
      stack: error.stack,
      type: error.name
    });
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check if the backend server is running.`);
    }
    
    throw error;
  }
};

// ---------------------
// Patient API functions
// ---------------------
export const patientAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/patients?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/patients/${id}`),
  create: async (patientData) => apiRequest('/patients', { method: 'POST', body: JSON.stringify(patientData) }),
  update: async (id, patientData) => apiRequest(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(patientData) }),
  delete: async (id) => apiRequest(`/patients/${id}`, { method: 'DELETE' }),
  getStats: async () => apiRequest('/patients/stats'),
  search: async (query) => apiRequest(`/patients/search?q=${encodeURIComponent(query)}`)
};

// ------------------------
// Appointment API functions
// ------------------------
export const appointmentAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/appointments?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/appointments/${id}`),
  create: async (appointmentData) => apiRequest('/appointments', { method: 'POST', body: JSON.stringify(appointmentData) }),
  update: async (id, appointmentData) => apiRequest(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(appointmentData) }),
  delete: async (id) => apiRequest(`/appointments/${id}`, { method: 'DELETE' }),
  getToday: async () => apiRequest('/appointments/today'),
  getUpcoming: async () => apiRequest('/appointments/upcoming'),
  getStats: async () => apiRequest('/appointments/stats')
};

// ------------------------
// Consultation API functions
// ------------------------
export const consultationAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/consultations?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/consultations/${id}`),
  create: async (consultationData) => apiRequest('/consultations', { method: 'POST', body: JSON.stringify(consultationData) }),
  update: async (id, consultationData) => apiRequest(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(consultationData) }),
  delete: async (id) => apiRequest(`/consultations/${id}`, { method: 'DELETE' }),
  getStats: async () => apiRequest('/consultations/stats'),
  updateStatus: async (id, status) => apiRequest(`/consultations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};

// -------------------
// Referral API functions
// -------------------
export const referralAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/referrals?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/referrals/${id}`),
  create: async (referralData) => apiRequest('/referrals', { method: 'POST', body: JSON.stringify(referralData) }),
  update: async (id, referralData) => apiRequest(`/referrals/${id}`, { method: 'PUT', body: JSON.stringify(referralData) }),
  delete: async (id) => apiRequest(`/referrals/${id}`, { method: 'DELETE' }),
  updateStatus: async (id, status) => apiRequest(`/referrals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getStats: async () => apiRequest('/referrals/stats/summary'),
  generateLink: async (id) => apiRequest(`/referrals/${id}/generate-link`, { method: 'POST' }),
  getByCode: async (code) => apiRequest(`/referrals/shared/${code}`),
  deactivateLink: async (id) => apiRequest(`/referrals/${id}/deactivate-link`, { method: 'PATCH' })
};

// -----------------
// Invoice API functions
// -----------------
export const invoiceAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/invoices?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/invoices/${id}`),
  create: async (invoiceData) => apiRequest('/invoices', { method: 'POST', body: JSON.stringify(invoiceData) }),
  update: async (id, invoiceData) => apiRequest(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(invoiceData) }),
  updateStatus: async (id, status) => apiRequest(`/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: async (id) => apiRequest(`/invoices/${id}`, { method: 'DELETE' }),
  getStats: async () => apiRequest('/invoices/stats'),
  getCurrentMonthRevenue: async () => apiRequest('/invoices/stats/current-month-revenue')
};

// -----------------
// Post API functions
// -----------------
export const postAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/posts?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/posts/${id}`),
  create: async (postData) => apiRequest('/posts', { method: 'POST', body: JSON.stringify(postData) }),
  update: async (id, postData) => apiRequest(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(postData) }),
  delete: async (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' }),
  getStats: async () => apiRequest('/posts/stats'),
  searchByTags: async (tags) => apiRequest(`/posts/search?tags=${encodeURIComponent(tags.join(','))}`)
};

// ---------------------------
// Compliance Alert API functions
// ---------------------------
export const complianceAlertAPI = {
  getAll: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...filters });
    return apiRequest(`/compliance-alerts?${queryParams}`);
  },
  getById: async (id) => apiRequest(`/compliance-alerts/${id}`),
  create: async (alertData) => apiRequest('/compliance-alerts', { method: 'POST', body: JSON.stringify(alertData) }),
  update: async (id, alertData) => apiRequest(`/compliance-alerts/${id}`, { method: 'PUT', body: JSON.stringify(alertData) }),
  updateStatus: async (id, status, resolutionNotes = '') => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, resolutionNotes }) }),
  delete: async (id) => apiRequest(`/compliance-alerts/${id}`, { method: 'DELETE' }),
  getStats: async () => apiRequest('/compliance-alerts/stats'),
  getByPatient: async (patientId) => apiRequest(`/compliance-alerts/patient/${patientId}`),
  acknowledge: async (id) => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Acknowledged' }) }),
  resolve: async (id, resolutionNotes = '') => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Resolved', resolutionNotes }) }),
  dismiss: async (id) => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Dismissed' }) }),
  getComplianceRate: async () => {
    const response = await apiRequest('/compliance-alerts/stats');
    return response.data.overview.complianceRate;
  }
};

// -----------------
// Doctor API functions
// -----------------
export const doctorAPI = {
  getAll: async () => apiRequest('/doctors'),
  getById: async (id) => apiRequest(`/doctors/${id}`),
  create: async (doctorData) => apiRequest('/doctors', { method: 'POST', body: JSON.stringify(doctorData) }),
  update: async (id, doctorData) => apiRequest(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(doctorData) }),
  delete: async (id) => apiRequest(`/doctors/${id}`, { method: 'DELETE' }),
  search: async (query) => apiRequest(`/doctors/search?q=${encodeURIComponent(query)}`)
};

// -----------------
// Nurse API functions
// -----------------
export const nurseAPI = {
  getAll: async () => apiRequest('/nurses'),
  getById: async (id) => apiRequest(`/nurses/${id}`),
  create: async (nurseData) => apiRequest('/nurses', { method: 'POST', body: JSON.stringify(nurseData) }),
  update: async (id, nurseData) => apiRequest(`/nurses/${id}`, { method: 'PUT', body: JSON.stringify(nurseData) }),
  delete: async (id) => apiRequest(`/nurses/${id}`, { method: 'DELETE' }),
  search: async (query) => apiRequest(`/nurses/search?q=${encodeURIComponent(query)}`)
};

// -----------------
// Clinic API functions
// -----------------
export const clinicAPI = {
  login: async (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: async () => apiRequest('/auth/me'),
  updateProfile: async (payload) => apiRequest('/clinics/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  changePassword: async (payload) => apiRequest('/clinics/change-password', { method: 'PUT', body: JSON.stringify(payload) }),
  getAll: async () => apiRequest('/clinics/all')
};

// -----------------
// Auth API functions
// -----------------
export const authAPI = {
  setToken: (token) => {
    authToken = token;
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  },
  clearToken: () => authToken = null,
  register: async (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: async (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  requestOTP: async (email) => apiRequest('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  loginWithOTP: async (email, otp) => apiRequest('/auth/login-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  me: async () => apiRequest('/auth/me')
};

// ---------------------
// Email Config API functions
// ---------------------
export const emailConfigAPI = {
  getAll: async (doctorId) => apiRequest(`/email-config?doctorId=${doctorId}`),
  getActive: async (doctorId) => apiRequest(`/email-config/active/${doctorId}`),
  create: async (config) => apiRequest('/email-config', { method: 'POST', body: JSON.stringify(config) }),
  update: async (id, config) => apiRequest(`/email-config/${id}`, { method: 'PUT', body: JSON.stringify(config) }),
  delete: async (id) => apiRequest(`/email-config/${id}`, { method: 'DELETE' }),
  test: async (id) => apiRequest(`/email-config/${id}/test`, { method: 'POST' }),
  setDefault: async (id) => apiRequest(`/email-config/${id}/set-default`, { method: 'POST' }),
  createDefault: async (doctorId, email, password, displayName) => apiRequest('/email-config/create-default', { method: 'POST', body: JSON.stringify({ doctorId, email, password, displayName }) })
};

export default {
  patientAPI,
  appointmentAPI,
  consultationAPI,
  referralAPI,
  invoiceAPI,
  postAPI,
  authAPI,
  complianceAlertAPI,
  emailConfigAPI,
  doctorAPI,
  nurseAPI,
  clinicAPI
};
