import React, { useState, useEffect } from 'react'
import { ArrowRightLeft, Search, Filter, Plus, Eye, Edit, Trash2, User, Calendar, Clock, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Referrals = () => {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Sample referrals data
  useEffect(() => {
    const sampleReferrals = [
      {
        id: 'REF001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        fromDoctor: 'Dr. Sarah Wilson',
        toDoctor: 'Dr. Michael Brown',
        fromDepartment: 'Cardiology',
        toDepartment: 'Neurology',
        referralDate: '2024-01-15',
        appointmentDate: '2024-01-20',
        reason: 'Suspected neurological complications related to cardiac condition',
        priority: 'urgent',
        status: 'pending',
        notes: 'Patient experiencing dizziness and coordination issues',
        type: 'internal'
      },
      {
        id: 'REF002',
        patientId: 'PAT002',
        patientName: 'Jane Smith',
        fromDoctor: 'Dr. Emily Davis',
        toDoctor: 'Dr. James Miller',
        fromDepartment: 'Pediatrics',
        toDepartment: 'Orthopedics',
        referralDate: '2024-01-16',
        appointmentDate: '2024-01-22',
        reason: 'Suspected fracture in left arm',
        priority: 'routine',
        status: 'approved',
        notes: 'Child fell from playground equipment',
        type: 'internal'
      },
      {
        id: 'REF003',
        patientId: 'PAT003',
        patientName: 'Robert Johnson',
        fromDoctor: 'Dr. Lisa Anderson',
        toDoctor: 'External Specialist',
        fromDepartment: 'Dermatology',
        toDepartment: 'Oncology Center',
        referralDate: '2024-01-17',
        appointmentDate: '2024-01-25',
        reason: 'Suspicious skin lesion requiring specialized evaluation',
        priority: 'urgent',
        status: 'completed',
        notes: 'Biopsy results needed for further treatment planning',
        type: 'external'
      },
      {
        id: 'REF004',
        patientId: 'PAT004',
        patientName: 'Maria Garcia',
        fromDoctor: 'Dr. Mark Roberts',
        toDoctor: 'Dr. Sarah Wilson',
        fromDepartment: 'Radiology',
        toDepartment: 'Cardiology',
        referralDate: '2024-01-18',
        appointmentDate: '2024-01-24',
        reason: 'Abnormal cardiac imaging findings',
        priority: 'urgent',
        status: 'pending',
        notes: 'CT scan shows potential cardiac abnormalities',
        type: 'internal'
      },
      {
        id: 'REF005',
        patientId: 'PAT005',
        patientName: 'David Wilson',
        fromDoctor: 'Dr. Emily Davis',
        toDoctor: 'External Clinic',
        fromDepartment: 'Pediatrics',
        toDepartment: 'Child Psychology',
        referralDate: '2024-01-19',
        appointmentDate: '2024-01-30',
        reason: 'Behavioral assessment and counseling',
        priority: 'routine',
        status: 'approved',
        notes: 'Parent concerns about child behavior patterns',
        type: 'external'
      },
      {
        id: 'REF006',
        patientId: 'PAT006',
        patientName: 'Sarah Thompson',
        fromDoctor: 'Dr. James Miller',
        toDoctor: 'Dr. Mark Roberts',
        fromDepartment: 'Orthopedics',
        toDepartment: 'Radiology',
        referralDate: '2024-01-20',
        appointmentDate: '2024-01-21',
        reason: 'MRI scan for knee injury assessment',
        priority: 'routine',
        status: 'completed',
        notes: 'Post-surgery follow-up imaging required',
        type: 'internal'
      }
    ]
    
    setTimeout(() => {
      setReferrals(sampleReferrals)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.fromDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.toDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || referral.status === filterStatus
    const matchesType = filterType === 'all' || referral.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 font-semibold'
      case 'routine': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    approved: referrals.filter(r => r.status === 'approved').length,
    completed: referrals.filter(r => r.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ArrowRightLeft className="h-8 w-8 mr-3 text-gray-700" />
          Referrals Management
        </h1>
        <p className="text-gray-600">Manage patient referrals and inter-departmental transfers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ArrowRightLeft className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
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
              placeholder="Search by patient name, doctor, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Types</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Referral
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2 text-gray-600" />
            Referrals ({filteredReferrals.length} referrals)
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient & Referral ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Doctor/Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Doctor/Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates & Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason & Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReferrals.map((referral, index) => (
                  <tr key={referral.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Patient & Referral ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{referral.patientName}</div>
                          <div className="text-sm text-gray-500">Patient ID: {referral.patientId}</div>
                          <div className="text-xs text-gray-400">Ref ID: {referral.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* From Doctor/Department */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{referral.fromDoctor}</div>
                      <div className="text-sm text-gray-500">{referral.fromDepartment}</div>
                    </td>

                    {/* To Doctor/Department */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{referral.toDoctor}</div>
                      <div className="text-sm text-gray-500">{referral.toDepartment}</div>
                      <div className={`text-xs mt-1 ${referral.type === 'external' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {referral.type.toUpperCase()}
                      </div>
                    </td>

                    {/* Dates & Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        Referred: {new Date(referral.referralDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        Appointment: {new Date(referral.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className={`text-xs mt-1 ${getPriorityColor(referral.priority)}`}>
                        Priority: {referral.priority.toUpperCase()}
                      </div>
                    </td>

                    {/* Reason & Status */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 mb-2">{referral.reason}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                        {getStatusIcon(referral.status)}
                        <span className="ml-1 capitalize">{referral.status}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredReferrals.length === 0 && !loading && (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new referral.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Referrals
