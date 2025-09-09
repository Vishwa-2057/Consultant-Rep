import React, { useState, useEffect } from 'react'
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Mail, Users, Calendar, Search, Filter, Eye, Star, Clock, Shield } from 'lucide-react'
import { clinicsAPI } from '../../services/api'
import { toast } from 'react-hot-toast'

const ClinicManagement = () => {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    type: "",
    registrationNumber: "",
    yearOfEstablishment: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    ownerName: "",
    ownerMedicalId: "",
    adminName: "",
    adminContact: "",
    adminEmail: "",
    tradeLicense: "",
    medicalCouncilCert: "",
    taxId: "",
    accreditation: "",
    specialties: [],
    services: [],
    operatingHours: "",
    staffCount: "",
    beds: "",
    pharmacyAvailable: false,
    laboratoryAvailable: false,
    paymentMethods: [],
    bankInfo: "",
    adminUsername: "",
    adminPassword: "",
  })

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      const response = await clinicsAPI.getAll()
      if (response.data.success) {
        setClinics(response.data.clinics)
      }
    } catch (error) {
      toast.error('Failed to load clinics')
    } finally {
      setLoading(false)
    }
  }

  const filteredClinics = clinics.filter(clinic =>
    clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.country?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      registrationNumber: "",
      yearOfEstablishment: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      ownerName: "",
      ownerMedicalId: "",
      adminName: "",
      adminContact: "",
      adminEmail: "",
      tradeLicense: "",
      medicalCouncilCert: "",
      taxId: "",
      accreditation: "",
      specialties: [],
      services: [],
      operatingHours: "",
      staffCount: "",
      beds: "",
      pharmacyAvailable: false,
      laboratoryAvailable: false,
      paymentMethods: [],
      bankInfo: "",
      adminUsername: "",
      adminPassword: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const clinicId = "UKGW" + Math.floor(100 + Math.random() * 900)
    const payload = { ...form, clinicId }
    
    try {
      const response = await clinicsAPI.create(payload)
      if (response.data.success) {
        toast.success("Clinic added successfully")
        setShowAddModal(false)
        resetForm()
        fetchClinics()
      } else {
        toast.error(response.data.message || "Failed to add clinic")
      }
    } catch (err) {
      toast.error("Failed to add clinic")
    } finally {
      setSaving(false)
    }
  }

  const ClinicCard = ({ clinic }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{clinic.name}</h3>
              <p className="text-blue-100">{clinic.type || 'General Clinic'}</p>
              <p className="text-xs text-blue-200 font-mono">{clinic.registrationNumber}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            clinic.status === 'active' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {clinic.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center text-gray-700 group-hover:text-blue-600 transition-colors">
            <MapPin className="h-4 w-4 mr-3 text-blue-500" />
            <span className="text-sm font-medium">{clinic.address || 'Address not provided'}</span>
          </div>
          <div className="flex items-center text-gray-700 group-hover:text-blue-600 transition-colors">
            <Phone className="h-4 w-4 mr-3 text-emerald-500" />
            <span className="text-sm font-medium">{clinic.phone || 'Phone not provided'}</span>
          </div>
          <div className="flex items-center text-gray-700 group-hover:text-blue-600 transition-colors">
            <Mail className="h-4 w-4 mr-3 text-purple-500" />
            <span className="text-sm font-medium">{clinic.email || 'Email not provided'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-bold text-gray-900">{clinic.staffCount || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Staff Members</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-bold text-gray-900">{clinic.beds || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Beds Available</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => {
              setSelectedClinic(clinic)
              setShowDetailsModal(true)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
          <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-xl transition-all duration-200">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
                <p className="text-gray-600 mt-1">Manage healthcare facilities and operations</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Clinic</span>
            </button>
          </div>
        </div>
      </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clinics by name, registration, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-2xl transition-all duration-200 flex items-center space-x-2 shadow-lg">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Total Clinics</p>
                <p className="text-3xl font-bold mt-2">{clinics.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 font-medium">Active Clinics</p>
                <p className="text-3xl font-bold mt-2">{clinics.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Total Staff</p>
                <p className="text-3xl font-bold mt-2">{clinics.reduce((sum, c) => sum + (parseInt(c.staffCount) || 0), 0)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">Total Beds</p>
                <p className="text-3xl font-bold mt-2">{clinics.reduce((sum, c) => sum + (parseInt(c.beds) || 0), 0)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Clinics Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredClinics.map((clinic) => (
              <ClinicCard key={clinic._id} clinic={clinic} />
            ))}
          </div>
        )}

        {filteredClinics.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No clinics found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first healthcare facility.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Your First Clinic
            </button>
          </div>
        )}

      {/* Add Clinic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 p-8 relative overflow-y-auto max-h-[95vh] border border-gray-100">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
              onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}
            >
              ✕
            </button>
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl inline-block mb-4">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Healthcare Facility</h2>
              <p className="text-gray-600">Complete the form below to register a new clinic</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Clinic Identity */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold mb-6 text-blue-900 flex items-center">
                  <Building2 className="h-6 w-6 mr-3" />
                  Clinic Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Enter clinic name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Clinic *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      value={form.type}
                      onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                    >
                      <option value="">Select clinic type</option>
                      <option value="General">General Clinic</option>
                      <option value="Dental">Dental Clinic</option>
                      <option value="Pediatric">Pediatric Clinic</option>
                      <option value="Cardiology">Cardiology Clinic</option>
                      <option value="Multi-specialty">Multi-specialty</option>
                      <option value="Diagnostic">Diagnostic Center</option>
                      <option value="Emergency">Emergency Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      value={form.registrationNumber}
                      onChange={(e) => setForm(f => ({ ...f, registrationNumber: e.target.value }))}
                      placeholder="REG123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Establishment *</label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max="2024"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      value={form.yearOfEstablishment}
                      onChange={(e) => setForm(f => ({ ...f, yearOfEstablishment: e.target.value }))}
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-xl font-bold mb-6 text-emerald-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-3" />
                  Contact & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Official Address *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.address}
                      onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Enter complete address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.city}
                      onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="City name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.state}
                      onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.country}
                      onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))}
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.zipCode}
                      onChange={(e) => setForm(f => ({ ...f, zipCode: e.target.value }))}
                      placeholder="Postal code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.phone}
                      onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1-555-0123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="clinic@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      value={form.website}
                      onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                      placeholder="https://www.clinic.com"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Credentials */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold mb-6 text-purple-900 flex items-center">
                  <Users className="h-6 w-6 mr-3" />
                  Administration & Login Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.adminName}
                      onChange={(e) => setForm(f => ({ ...f, adminName: e.target.value }))}
                      placeholder="Administrator full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Contact *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.adminContact}
                      onChange={(e) => setForm(f => ({ ...f, adminContact: e.target.value }))}
                      placeholder="+1-555-0124"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.adminEmail}
                      onChange={(e) => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                      placeholder="admin@clinic.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.ownerName}
                      onChange={(e) => setForm(f => ({ ...f, ownerName: e.target.value }))}
                      placeholder="Owner/Director name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Login Username *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.adminUsername}
                      onChange={(e) => setForm(f => ({ ...f, adminUsername: e.target.value }))}
                      placeholder="clinic_admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Login Password *</label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      value={form.adminPassword}
                      onChange={(e) => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                      placeholder="Secure password"
                    />
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold mb-6 text-orange-900 flex items-center">
                  <Building2 className="h-6 w-6 mr-3" />
                  Infrastructure & Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Staff Count</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                      value={form.staffCount}
                      onChange={(e) => setForm(f => ({ ...f, staffCount: e.target.value }))}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Beds Available</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                      value={form.beds}
                      onChange={(e) => setForm(f => ({ ...f, beds: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="pharmacy"
                      checked={form.pharmacyAvailable}
                      onChange={(e) => setForm(f => ({ ...f, pharmacyAvailable: e.target.checked }))}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="pharmacy" className="text-sm font-semibold text-gray-700">Pharmacy Available</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="laboratory"
                      checked={form.laboratoryAvailable}
                      onChange={(e) => setForm(f => ({ ...f, laboratoryAvailable: e.target.checked }))}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="laboratory" className="text-sm font-semibold text-gray-700">Laboratory Available</label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-8 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Clinic...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-5 w-5" />
                      <span>Create Clinic</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinic Details Modal */}
      {showDetailsModal && selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 p-8 relative overflow-y-auto max-h-[95vh] border border-gray-100">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
              onClick={() => {
                setShowDetailsModal(false)
                setSelectedClinic(null)
              }}
            >
              ✕
            </button>
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl inline-block mb-4">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedClinic.name}</h2>
              <p className="text-gray-600">{selectedClinic.type} • {selectedClinic.registrationNumber}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Location Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold text-gray-700">Address:</span> {selectedClinic.address}</div>
                    <div><span className="font-semibold text-gray-700">City:</span> {selectedClinic.city}</div>
                    <div><span className="font-semibold text-gray-700">State:</span> {selectedClinic.state}</div>
                    <div><span className="font-semibold text-gray-700">Country:</span> {selectedClinic.country}</div>
                    <div><span className="font-semibold text-gray-700">Zip Code:</span> {selectedClinic.zipCode}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold text-gray-700">Phone:</span> {selectedClinic.phone}</div>
                    <div><span className="font-semibold text-gray-700">Email:</span> {selectedClinic.email}</div>
                    <div><span className="font-semibold text-gray-700">Website:</span> {selectedClinic.website || "N/A"}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Administration
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold text-gray-700">Owner:</span> {selectedClinic.ownerName}</div>
                    <div><span className="font-semibold text-gray-700">Admin:</span> {selectedClinic.adminName}</div>
                    <div><span className="font-semibold text-gray-700">Admin Contact:</span> {selectedClinic.adminContact}</div>
                    <div><span className="font-semibold text-gray-700">Admin Email:</span> {selectedClinic.adminEmail}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                    Infrastructure
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold text-gray-700">Staff Count:</span> {selectedClinic.staffCount || "N/A"}</div>
                    <div><span className="font-semibold text-gray-700">Beds:</span> {selectedClinic.beds || "N/A"}</div>
                    <div><span className="font-semibold text-gray-700">Pharmacy:</span> {selectedClinic.pharmacyAvailable ? "Available" : "Not Available"}</div>
                    <div><span className="font-semibold text-gray-700">Laboratory:</span> {selectedClinic.laboratoryAvailable ? "Available" : "Not Available"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClinicManagement
