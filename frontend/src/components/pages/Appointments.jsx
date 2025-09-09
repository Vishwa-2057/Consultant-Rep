import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Search, Plus, Filter, CheckCircle, XCircle, AlertCircle, Phone, Mail, MapPin, Timer, Eye, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Sample data with comprehensive details
  useEffect(() => {
    const sampleAppointments = [
      {
        id: 'APT001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        doctorName: 'Dr. Sarah Wilson',
        date: '2024-01-15',
        time: '09:00',
        duration: '30 mins',
        location: 'Room 101, Cardiology Wing',
        status: 'confirmed',
        type: 'Consultation',
        phone: '+1234567890',
        email: 'john@example.com',
        department: 'Cardiology'
      },
      {
        id: 'APT002',
        patientId: 'PAT002',
        patientName: 'Jane Smith',
        doctorName: 'Dr. Michael Brown',
        date: '2024-01-15',
        time: '10:30',
        duration: '45 mins',
        location: 'Room 205, Neurology Wing',
        status: 'pending',
        type: 'Follow-up',
        phone: '+1234567891',
        email: 'jane@example.com',
        department: 'Neurology'
      },
      {
        id: 'APT003',
        patientId: 'PAT003',
        patientName: 'Robert Johnson',
        doctorName: 'Dr. Emily Davis',
        date: '2024-01-15',
        time: '14:00',
        duration: '20 mins',
        location: 'Room 302, General Medicine',
        status: 'completed',
        type: 'Check-up',
        phone: '+1234567892',
        email: 'robert@example.com',
        department: 'General Medicine'
      },
      {
        id: 'APT004',
        patientId: 'PAT004',
        patientName: 'Maria Garcia',
        doctorName: 'Dr. James Miller',
        date: '2024-01-16',
        time: '11:00',
        duration: '60 mins',
        location: 'Room 150, Orthopedics Wing',
        status: 'cancelled',
        type: 'Surgery Consultation',
        phone: '+1234567893',
        email: 'maria@example.com',
        department: 'Orthopedics'
      },
      {
        id: 'APT005',
        patientId: 'PAT005',
        patientName: 'David Wilson',
        doctorName: 'Dr. Lisa Anderson',
        date: '2024-01-15',
        time: '15:30',
        duration: '25 mins',
        location: 'Room 201, Pediatrics Wing',
        status: 'confirmed',
        type: 'Vaccination',
        phone: '+1234567894',
        email: 'david@example.com',
        department: 'Pediatrics'
      },
      {
        id: 'APT006',
        patientId: 'PAT006',
        patientName: 'Sarah Thompson',
        doctorName: 'Dr. Mark Roberts',
        date: '2024-01-15',
        time: '16:00',
        duration: '40 mins',
        location: 'Room 105, Dermatology Wing',
        status: 'pending',
        type: 'Skin Examination',
        phone: '+1234567895',
        email: 'sarah@example.com',
        department: 'Dermatology'
      },
      {
        id: 'APT007',
        patientId: 'PAT007',
        patientName: 'Michael Chen',
        doctorName: 'Dr. Rachel Green',
        date: '2024-01-15',
        time: '08:30',
        duration: '30 mins',
        location: 'Room 301, Endocrinology Wing',
        status: 'confirmed',
        type: 'Diabetes Check-up',
        phone: '+1234567896',
        email: 'michael@example.com',
        department: 'Endocrinology'
      },
      {
        id: 'APT008',
        patientId: 'PAT008',
        patientName: 'Emma Rodriguez',
        doctorName: 'Dr. Kevin Park',
        date: '2024-01-15',
        time: '13:15',
        duration: '45 mins',
        location: 'Room 202, Psychiatry Wing',
        status: 'completed',
        type: 'Therapy Session',
        phone: '+1234567897',
        email: 'emma@example.com',
        department: 'Psychiatry'
      },
      {
        id: 'APT009',
        patientId: 'PAT009',
        patientName: 'James Wilson',
        doctorName: 'Dr. Anna Martinez',
        date: '2024-01-16',
        time: '09:45',
        duration: '35 mins',
        location: 'Room 401, Ophthalmology Wing',
        status: 'confirmed',
        type: 'Eye Examination',
        phone: '+1234567898',
        email: 'james@example.com',
        department: 'Ophthalmology'
      },
      {
        id: 'APT010',
        patientId: 'PAT010',
        patientName: 'Lisa Brown',
        doctorName: 'Dr. Thomas Lee',
        date: '2024-01-16',
        time: '14:30',
        duration: '50 mins',
        location: 'Room 103, Gastroenterology Wing',
        status: 'pending',
        type: 'Endoscopy',
        phone: '+1234567899',
        email: 'lisa@example.com',
        department: 'Gastroenterology'
      },
      {
        id: 'APT011',
        patientId: 'PAT011',
        patientName: 'Alex Johnson',
        doctorName: 'Dr. Patricia White',
        date: '2024-01-17',
        time: '10:00',
        duration: '25 mins',
        location: 'Room 204, Radiology Wing',
        status: 'confirmed',
        type: 'X-Ray',
        phone: '+1234567800',
        email: 'alex@example.com',
        department: 'Radiology'
      },
      {
        id: 'APT012',
        patientId: 'PAT012',
        patientName: 'Sophie Davis',
        doctorName: 'Dr. Robert Kim',
        date: '2024-01-17',
        time: '11:30',
        duration: '40 mins',
        location: 'Room 305, Oncology Wing',
        status: 'pending',
        type: 'Chemotherapy',
        phone: '+1234567801',
        email: 'sophie@example.com',
        department: 'Oncology'
      },
      {
        id: 'APT013',
        patientId: 'PAT013',
        patientName: 'Ryan Miller',
        doctorName: 'Dr. Jennifer Clark',
        date: '2024-01-17',
        time: '15:00',
        duration: '30 mins',
        location: 'Room 102, Urology Wing',
        status: 'completed',
        type: 'Consultation',
        phone: '+1234567802',
        email: 'ryan@example.com',
        department: 'Urology'
      },
      {
        id: 'APT014',
        patientId: 'PAT014',
        patientName: 'Grace Taylor',
        doctorName: 'Dr. Steven Adams',
        date: '2024-01-18',
        time: '09:15',
        duration: '45 mins',
        location: 'Room 203, Rheumatology Wing',
        status: 'confirmed',
        type: 'Joint Examination',
        phone: '+1234567803',
        email: 'grace@example.com',
        department: 'Rheumatology'
      },
      {
        id: 'APT015',
        patientId: 'PAT015',
        patientName: 'Nathan Cooper',
        doctorName: 'Dr. Michelle Turner',
        date: '2024-01-18',
        time: '14:45',
        duration: '35 mins',
        location: 'Room 401, Pulmonology Wing',
        status: 'pending',
        type: 'Lung Function Test',
        phone: '+1234567804',
        email: 'nathan@example.com',
        department: 'Pulmonology'
      }
    ]
    
    setTimeout(() => {
      setAppointments(sampleAppointments)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    const matchesDate = appointment.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-600">{appointment.type}</p>
          </div>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {getStatusIcon(appointment.status)}
          <span className="ml-1 capitalize">{appointment.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.doctorName}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.email}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
        <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
          Edit
        </button>
        <button className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
          Confirm
        </button>
        <button className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
          Cancel
        </button>
      </div>
    </div>
  )

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Calendar className="h-8 w-8 mr-3 text-gray-700" />
          Appointments Management
        </h1>
        <p className="text-gray-600">Schedule and manage patient appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Modern Table View */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
            Appointments List ({filteredAppointments.length} appointments)
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Patient Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {appointment.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Appointment Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.type}</div>
                      <div className="text-sm text-gray-500">{appointment.department}</div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Timer className="h-3 w-3 mr-1" />
                        Duration: {appointment.duration}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        {appointment.time}
                      </div>
                    </td>

                    {/* Location & Doctor */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-2 text-purple-600" />
                        {appointment.doctorName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                        {appointment.location}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAppointments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or schedule a new appointment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Appointments
