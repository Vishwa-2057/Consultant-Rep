import { config } from '../config/env.js';

const API_BASE_URL = config.API_BASE_URL || 'http://localhost:5000/api';
let authToken = null;

// -----------------
// Auth token handling
// -----------------
const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) authToken = token;
};
initializeAuth();

export const setAuthToken = (token) => {
  authToken = token;
  if (token) localStorage.setItem('authToken', token);
  else localStorage.removeItem('authToken');
};

// -----------------
// Generic API request
// -----------------
const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    },
    ...options,
  };

  console.log('API request:', url, defaultOptions);

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      const error = new Error(message);
      error.response = response;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${url}. Is the backend running?`);
    }
    throw error;
  }
};

// -----------------
// Auth API
// -----------------
export const authAPI = {
  setToken: setAuthToken,
  clearToken: () => setAuthToken(null),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  requestOTP: ({ email }) => apiRequest('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  loginWithOTP: ({ email, otp }) => apiRequest('/auth/login-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  me: () => apiRequest('/auth/me'),
};

// -----------------
// Patient API
// -----------------
export const patientAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/patients?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/patients/${id}`),
  create: (data) => apiRequest('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/patients/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/patients/stats'),
  search: (query) => apiRequest(`/patients/search?q=${encodeURIComponent(query)}`),
};

// -----------------
// Appointment API
// -----------------
export const appointmentAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/appointments?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/appointments/${id}`),
  create: (data) => apiRequest('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/appointments/${id}`, { method: 'DELETE' }),
  getToday: () => apiRequest('/appointments/today'),
  getUpcoming: () => apiRequest('/appointments/upcoming'),
  getStats: () => apiRequest('/appointments/stats'),
};

// -----------------
// Consultation API
// -----------------
export const consultationAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/consultations?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/consultations/${id}`),
  create: (data) => apiRequest('/consultations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/consultations/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/consultations/stats'),
  updateStatus: (id, status) => apiRequest(`/consultations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// -----------------
// Referral API
// -----------------
export const referralAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/referrals?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/referrals/${id}`),
  create: (data) => apiRequest('/referrals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/referrals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/referrals/${id}`, { method: 'DELETE' }),
  updateStatus: (id, status) => apiRequest(`/referrals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getStats: () => apiRequest('/referrals/stats/summary'),
  generateLink: (id) => apiRequest(`/referrals/${id}/generate-link`, { method: 'POST' }),
  getByCode: (code) => apiRequest(`/referrals/shared/${code}`),
  deactivateLink: (id) => apiRequest(`/referrals/${id}/deactivate-link`, { method: 'PATCH' }),
};

// -----------------
// Invoice API
// -----------------
export const invoiceAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/invoices?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/invoices/${id}`),
  create: (data) => apiRequest('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiRequest(`/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => apiRequest(`/invoices/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/invoices/stats'),
  getCurrentMonthRevenue: () => apiRequest('/invoices/stats/current-month-revenue'),
};

// -----------------
// Post API
// -----------------
export const postAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/posts?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/posts/${id}`),
  create: (data) => apiRequest('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/posts/stats'),
  searchByTags: (tags) => apiRequest(`/posts/search?tags=${encodeURIComponent(tags.join(','))}`),
};

// -----------------
// Compliance Alert API
// -----------------
export const complianceAlertAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => apiRequest(`/compliance-alerts?${new URLSearchParams({ page, limit, ...filters })}`),
  getById: (id) => apiRequest(`/compliance-alerts/${id}`),
  create: (data) => apiRequest('/compliance-alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/compliance-alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status, resolutionNotes = '') => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, resolutionNotes }) }),
  delete: (id) => apiRequest(`/compliance-alerts/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/compliance-alerts/stats'),
  getByPatient: (patientId) => apiRequest(`/compliance-alerts/patient/${patientId}`),
  acknowledge: (id) => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Acknowledged' }) }),
  resolve: (id, resolutionNotes = '') => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Resolved', resolutionNotes }) }),
  dismiss: (id) => apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Dismissed' }) }),
  getComplianceRate: async () => {
    const res = await apiRequest('/compliance-alerts/stats');
    return res.data?.overview?.complianceRate || 0;
  },
};

// -----------------
// Doctor API
// -----------------
export const doctorAPI = {
  getAll: () => apiRequest('/doctors'),
  getById: (id) => apiRequest(`/doctors/${id}`),
  create: (data) => apiRequest('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/doctors/${id}`, { method: 'DELETE' }),
  search: (query) => apiRequest(`/doctors/search?q=${encodeURIComponent(query)}`),
};

// -----------------
// Nurse API
// -----------------
export const nurseAPI = {
  getAll: () => apiRequest('/nurses'),
  getById: (id) => apiRequest(`/nurses/${id}`),
  create: (data) => apiRequest('/nurses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/nurses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/nurses/${id}`, { method: 'DELETE' }),
  search: (query) => apiRequest(`/nurses/search?q=${encodeURIComponent(query)}`),
};

// -----------------
// Clinic API
// -----------------
export const clinicAPI = {
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiRequest('/auth/me'),
  updateProfile: (payload) => apiRequest('/clinics/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  changePassword: (payload) => apiRequest('/clinics/change-password', { method: 'PUT', body: JSON.stringify(payload) }),
  getAll: () => apiRequest('/clinics/all'),
};

// -----------------
// Email Config API
// -----------------
export const emailConfigAPI = {
  getAll: (doctorId) => apiRequest(`/email-config?doctorId=${doctorId}`),
  getActive: (doctorId) => apiRequest(`/email-config/active/${doctorId}`),
  create: (data) => apiRequest('/email-config', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/email-config/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/email-config/${id}`, { method: 'DELETE' }),
  test: (id) => apiRequest(`/email-config/${id}/test`, { method: 'POST' }),
  setDefault: (id) => apiRequest(`/email-config/${id}/set-default`, { method: 'POST' }),
  createDefault: (doctorId, email, password, displayName) =>
    apiRequest('/email-config/create-default', { method: 'POST', body: JSON.stringify({ doctorId, email, password, displayName }) }),
};

// -----------------
// Users API
// -----------------
export const userAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// -----------------
// Export all APIs
// -----------------
export default {
  authAPI,
  patientAPI,
  appointmentAPI,
  consultationAPI,
  referralAPI,
  invoiceAPI,
  postAPI,
  complianceAlertAPI,
  doctorAPI,
  nurseAPI,
  clinicAPI,
  emailConfigAPI,
  userAPI,
};
