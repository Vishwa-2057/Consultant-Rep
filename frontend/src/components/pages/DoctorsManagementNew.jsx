import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  UserCheck,
  UserX,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    inactiveDoctors: 0,
    specialties: []
  });
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialty: '',
    phone: '',
    role: 'doctor'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch doctors from backend
  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filterSpecialty !== 'all' && { specialty: filterSpecialty }),
        ...(filterStatus !== 'all' && { status: filterStatus === 'active' })
      };
      
      const response = await doctorService.getDoctors(params);
      setDoctors(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to sample data if backend is not available
      const sampleDoctors = [
        {
          _id: 'DOC001',
          fullName: 'Dr. Sarah Wilson',
          specialty: 'Cardiology',
          email: 'sarah.wilson@hospital.com',
          phone: '+1 (555) 123-4567',
          isActive: true,
          role: 'doctor',
          createdAt: '2020-01-15'
        },
        {
          _id: 'DOC002',
          fullName: 'Dr. Michael Brown',
          specialty: 'Neurology',
          email: 'michael.brown@hospital.com',
          phone: '+1 (555) 234-5678',
          isActive: true,
          role: 'doctor',
          createdAt: '2021-03-20'
        }
      ];
      setDoctors(sampleDoctors);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor statistics
  const fetchStats = async () => {
    try {
      const response = await doctorService.getDoctorStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback stats
      setStats({
        totalDoctors: doctors.length,
        activeDoctors: doctors.filter(d => d.isActive).length,
        inactiveDoctors: doctors.filter(d => !d.isActive).length,
        specialties: [...new Set(doctors.map(d => d.specialty))]
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchDoctors();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDoctors(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterSpecialty, filterStatus]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!editingDoctor && !formData.password.trim()) errors.password = 'Password is required';
    if (!editingDoctor && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.specialty.trim()) errors.specialty = 'Specialty is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingDoctor) {
        // Update existing doctor
        const updateData = { ...formData };
        delete updateData.password; // Don't send password on update
        await doctorService.updateDoctor(editingDoctor._id, updateData);
        console.log('Doctor updated successfully');
      } else {
        // Create new doctor
        await doctorService.createDoctor(formData);
        console.log('Doctor created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchDoctors(currentPage);
      fetchStats();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert(error.message || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      specialty: '',
      phone: '',
      role: 'doctor'
    });
    setEditingDoctor(null);
    setFormErrors({});
  };

  // Handle edit doctor
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      fullName: doctor.fullName,
      email: doctor.email,
      password: '',
      specialty: doctor.specialty,
      phone: doctor.phone,
      role: doctor.role
    });
    setShowModal(true);
  };

  // Handle delete doctor
  const handleDelete = async () => {
    if (!doctorToDelete) return;
    
    try {
      setLoading(true);
      await doctorService.deleteDoctor(doctorToDelete._id);
      console.log('Doctor deleted successfully');
      setShowDeleteModal(false);
      setDoctorToDelete(null);
      fetchDoctors(currentPage);
      fetchStats();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert(error.message || 'Failed to delete doctor');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDoctors(page);
  };

  const specialties = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Psychiatry', 'Radiology', 'Anesthesiology', 'Emergency Medicine', 'General Practice'
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctors Management</h1>
        <p className="text-gray-600">Manage doctor profiles, specialties, and information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Doctors</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Doctors</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactiveDoctors}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Specialties</p>
              <p className="text-2xl font-bold text-purple-600">{stats.specialties.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search doctors by name, email, or specialty..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Loading doctors...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {doctor.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doctor.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {doctor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doctor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDoctorToDelete(doctor);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {!editingDoctor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty *
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.specialty ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                {formErrors.specialty && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.specialty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : editingDoctor ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete Doctor</h2>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{doctorToDelete?.fullName}</strong>? 
              This will deactivate the doctor's account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDoctorToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;
