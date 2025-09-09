import React, { useState, useEffect } from 'react'
import { HelpCircle, Search, Filter, Plus, Eye, Edit, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, XCircle, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  // Sample support tickets data
  useEffect(() => {
    const sampleTickets = [
      {
        id: 'TICK001',
        title: 'Login Issues with EMR System',
        description: 'Unable to access patient records after recent update',
        userId: 'USER001',
        userName: 'Dr. Sarah Wilson',
        userEmail: 'sarah.wilson@hospital.com',
        category: 'technical',
        priority: 'high',
        status: 'open',
        createdDate: '2024-01-20',
        updatedDate: '2024-01-20',
        assignedTo: 'Support Team A',
        responses: 3,
        department: 'Cardiology'
      },
      {
        id: 'TICK002',
        title: 'Prescription Module Not Working',
        description: 'Error when trying to generate prescriptions for patients',
        userId: 'USER002',
        userName: 'Dr. Michael Brown',
        userEmail: 'michael.brown@hospital.com',
        category: 'bug',
        priority: 'urgent',
        status: 'in_progress',
        createdDate: '2024-01-19',
        updatedDate: '2024-01-20',
        assignedTo: 'Tech Support',
        responses: 5,
        department: 'Neurology'
      },
      {
        id: 'TICK003',
        title: 'Request for Additional User Training',
        description: 'Need training session for new staff members on EMR usage',
        userId: 'USER003',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@hospital.com',
        category: 'training',
        priority: 'medium',
        status: 'resolved',
        createdDate: '2024-01-18',
        updatedDate: '2024-01-19',
        assignedTo: 'Training Team',
        responses: 2,
        department: 'Administration'
      },
      {
        id: 'TICK004',
        title: 'Billing Report Generation Error',
        description: 'Monthly billing reports are not generating correctly',
        userId: 'USER004',
        userName: 'James Miller',
        userEmail: 'james.miller@hospital.com',
        category: 'billing',
        priority: 'high',
        status: 'open',
        createdDate: '2024-01-17',
        updatedDate: '2024-01-18',
        assignedTo: 'Billing Support',
        responses: 1,
        department: 'Finance'
      },
      {
        id: 'TICK005',
        title: 'Feature Request: Dark Mode',
        description: 'Request to add dark mode theme to the EMR interface',
        userId: 'USER005',
        userName: 'Lisa Anderson',
        userEmail: 'lisa.anderson@hospital.com',
        category: 'feature_request',
        priority: 'low',
        status: 'pending',
        createdDate: '2024-01-16',
        updatedDate: '2024-01-16',
        assignedTo: 'Development Team',
        responses: 0,
        department: 'Pharmacy'
      },
      {
        id: 'TICK006',
        title: 'Patient Data Export Issues',
        description: 'Cannot export patient data to external systems',
        userId: 'USER006',
        userName: 'Mark Roberts',
        userEmail: 'mark.roberts@hospital.com',
        category: 'technical',
        priority: 'medium',
        status: 'closed',
        createdDate: '2024-01-15',
        updatedDate: '2024-01-17',
        assignedTo: 'Integration Team',
        responses: 4,
        department: 'IT'
      }
    ]
    
    setTimeout(() => {
      setTickets(sampleTickets)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'closed': return <XCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 font-bold'
      case 'high': return 'text-orange-600 font-semibold'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'bug': return 'bg-red-100 text-red-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'billing': return 'bg-yellow-100 text-yellow-800'
      case 'feature_request': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <HelpCircle className="h-8 w-8 mr-3 text-gray-700" />
          Customer Support
        </h1>
        <p className="text-gray-600">Manage support tickets and help requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Tickets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
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
              placeholder="Search by title, user name, or description..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-gray-600" />
            Support Tickets ({filteredTickets.length} tickets)
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
                    Ticket & User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment & Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Responses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Ticket & User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ticket.userName}</div>
                          <div className="text-sm text-gray-500">{ticket.userEmail}</div>
                          <div className="text-xs text-gray-400">Ticket: {ticket.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Issue Details */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{ticket.description}</div>
                      <div className="text-xs text-gray-400">{ticket.department}</div>
                    </td>

                    {/* Category & Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)} mb-1`}>
                        {ticket.category.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className={`text-sm ${getPriorityColor(ticket.priority)}`}>
                        Priority: {ticket.priority.toUpperCase()}
                      </div>
                    </td>

                    {/* Assignment & Dates */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.assignedTo}</div>
                      <div className="text-sm text-gray-500">Created: {new Date(ticket.createdDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Updated: {new Date(ticket.updatedDate).toLocaleDateString()}</div>
                    </td>

                    {/* Status & Responses */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} mb-2`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {ticket.responses} responses
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
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTickets.length === 0 && !loading && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new support ticket.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSupport
