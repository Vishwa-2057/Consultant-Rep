import { config } from '../config/env.js';

// -----------------
// Base URL
// -----------------
const API_BASE_URL =
  config.API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://consultant-rep-1.onrender.com/api'
    : 'http://localhost:5000/api');

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
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
      throw new Error(
        `Network error: Unable to connect to ${url}. Is the backend running?`
      );
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
  register: (payload) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  requestOTP: (payload) =>
    apiRequest('/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) }),
  loginWithOTP: (payload) =>
    apiRequest('/auth/login-otp', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiRequest('/auth/me'),
};

// -----------------
// Patient API
// -----------------
export const patientAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/patients?${query}`);
  },
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
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/appointments?${query}`);
  },
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
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/consultations?${query}`);
  },
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
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/referrals?${query}`);
  },
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

export const complianceAlertAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/compliance-alerts?${query}`);
  },
  getById: (id) => apiRequest(`/compliance-alerts/${id}`),
  create: (data) => apiRequest('/compliance-alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/compliance-alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status, resolutionNotes = '') =>
    apiRequest(`/compliance-alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, resolutionNotes }) }),
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
// Invoice API
// -----------------
export const invoiceAPI = {
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return apiRequest(`/invoices?${query}`);
  },
  getById: (id) => apiRequest(`/invoices/${id}`),
  create: (data) => apiRequest('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiRequest(`/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => apiRequest(`/invoices/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/invoices/stats'),
  getCurrentMonthRevenue: () => apiRequest('/invoices/stats/current-month-revenue'),
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
// Export all APIs
// -----------------
export default {
  authAPI,
  patientAPI,
  appointmentAPI,
  consultationAPI,
  referralAPI,
  invoiceAPI,
  complianceAlertAPI,
  doctorAPI,
  nurseAPI,
  clinicAPI,
  emailConfigAPI,
};
