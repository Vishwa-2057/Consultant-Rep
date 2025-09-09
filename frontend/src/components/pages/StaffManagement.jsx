import React, { useState, useEffect } from 'react'
import { Users, Search, Filter, Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, Shield, Clock, UserCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Sample staff data
  useEffect(() => {
    const sampleStaff = [
      {
        id: 'STAFF001',
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@hospital.com',
        phone: '+1 (555) 123-4567',
        role: 'doctor',
        department: 'Cardiology',
        status: 'active',
        joinDate: '2020-01-15',
        lastLogin: '2024-01-20 09:30',
        permissions: ['patient_read', 'patient_write', 'prescription_write'],
        address: '123 Medical Center Dr, City, State 12345',
        emergencyContact: '+1 (555) 987-6543',
        employeeId: 'EMP001'
      },
      {
        id: 'STAFF002',
        name: 'Michael Brown',
        email: 'michael.brown@hospital.com',
        phone: '+1 (555) 234-5678',
        role: 'nurse',
        department: 'Emergency',
        status: 'active',
        joinDate: '2021-03-20',
        lastLogin: '2024-01-20 08:15',
        permissions: ['patient_read', 'vitals_write', 'medication_admin'],
        address: '456 Healthcare Ave, City, State 12345',
        emergencyContact: '+1 (555) 876-5432',
        employeeId: 'EMP002'
      },
      {
        id: 'STAFF003',
        name: 'Emily Davis',
        email: 'emily.davis@hospital.com',
        phone: '+1 (555) 345-6789',
        role: 'admin',
        department: 'Administration',
        status: 'active',
        joinDate: '2019-06-10',
        lastLogin: '2024-01-19 17:45',
        permissions: ['user_management', 'system_config', 'reports_access'],
        address: '789 Admin Building, City, State 12345',
        emergencyContact: '+1 (555) 765-4321',
        employeeId: 'EMP003'
      },
      {
        id: 'STAFF004',
        name: 'James Miller',
        email: 'james.miller@hospital.com',
        phone: '+1 (555) 456-7890',
        role: 'technician',
        department: 'Radiology',
        status: 'active',
        joinDate: '2022-09-05',
        lastLogin: '2024-01-20 07:00',
        permissions: ['equipment_access', 'imaging_read', 'report_generate'],
        address: '321 Tech Center, City, State 12345',
        emergencyContact: '+1 (555) 654-3210',
        employeeId: 'EMP004'
      },
      {
        id: 'STAFF005',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@hospital.com',
        phone: '+1 (555) 567-8901',
        role: 'pharmacist',
        department: 'Pharmacy',
        status: 'on_leave',
        joinDate: '2021-11-12',
        lastLogin: '2024-01-10 16:30',
        permissions: ['medication_dispense', 'inventory_manage', 'prescription_review'],
        address: '654 Pharmacy Wing, City, State 12345',
        emergencyContact: '+1 (555) 543-2109',
        employeeId: 'EMP005'
      },
      {
        id: 'STAFF006',
        name: 'Mark Roberts',
        email: 'mark.roberts@hospital.com',
        phone: '+1 (555) 678-9012',
        role: 'receptionist',
        department: 'Front Desk',
        status: 'active',
        joinDate: '2023-02-18',
        lastLogin: '2024-01-20 08:00',
        permissions: ['appointment_manage', 'patient_checkin', 'basic_info_edit'],
        address: '987 Reception Area, City, State 12345',
        emergencyContact: '+1 (555) 432-1098',
        employeeId: 'EMP006'
      }
    ]
    
    setTimeout(() => {
      setStaff(sampleStaff)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'on_leave': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'doctor': return 'text-blue-600'
      case 'nurse': return 'text-green-600'
      case 'admin': return 'text-purple-600'
      case 'technician': return 'text-orange-600'
      case 'pharmacist': return 'text-indigo-600'
      case 'receptionist': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const roles = [...new Set(staff.map(member => member.role))]

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on_leave').length,
    doctors: staff.filter(s => s.role === 'doctor').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="h-8 w-8 mr-3 text-gray-700" />
          Staff Management
        </h1>
        <p className="text-gray-600">Manage hospital staff and user administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Doctors</p>
              <p className="text-2xl font-bold text-blue-600">{stats.doctors}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-400" />
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
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            Staff Members ({filteredStaff.length} staff)
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
                    Staff Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employment Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Access
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member, index) => (
                  <tr key={member.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Staff Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">ID: {member.employeeId}</div>
                          <div className="text-xs text-gray-400">Staff ID: {member.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-600" />
                        {member.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-600" />
                        {member.phone}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        Emergency: {member.emergencyContact}
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${getRoleColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">{member.department}</div>
                      <div className="text-xs text-gray-400">{member.permissions.length} permissions</div>
                    </td>

                    {/* Employment Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        Joined: {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        Last Login: {new Date(member.lastLogin).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status & Access */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)} mb-2`}>
                        <span className="capitalize">{member.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <Shield className="h-3 w-3 inline mr-1" />
                        {member.permissions.slice(0, 2).join(', ')}
                        {member.permissions.length > 2 && ` +${member.permissions.length - 2} more`}
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

        {filteredStaff.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new staff member.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffManagement
