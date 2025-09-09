import React, { useState, useEffect } from 'react'
import { TestTube, Search, Filter, Download, Eye, FileText, Calendar, Clock, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const LabDiagnostics = () => {
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Sample lab test data
  useEffect(() => {
    const sampleLabTests = [
      {
        id: 'LAB001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        testType: 'Complete Blood Count (CBC)',
        orderedBy: 'Dr. Sarah Wilson',
        date: '2024-01-15',
        time: '09:30',
        status: 'completed',
        priority: 'routine',
        results: 'Normal',
        department: 'Hematology',
        sampleType: 'Blood',
        reportUrl: '/reports/lab001.pdf'
      },
      {
        id: 'LAB002',
        patientId: 'PAT002',
        patientName: 'Jane Smith',
        testType: 'Lipid Profile',
        orderedBy: 'Dr. Michael Brown',
        date: '2024-01-15',
        time: '10:15',
        status: 'pending',
        priority: 'urgent',
        results: 'Pending',
        department: 'Biochemistry',
        sampleType: 'Blood',
        reportUrl: null
      },
      {
        id: 'LAB003',
        patientId: 'PAT003',
        patientName: 'Robert Johnson',
        testType: 'Chest X-Ray',
        orderedBy: 'Dr. Emily Davis',
        date: '2024-01-15',
        time: '11:00',
        status: 'completed',
        priority: 'routine',
        results: 'Clear lungs, no abnormalities',
        department: 'Radiology',
        sampleType: 'Imaging',
        reportUrl: '/reports/lab003.pdf'
      },
      {
        id: 'LAB004',
        patientId: 'PAT004',
        patientName: 'Maria Garcia',
        testType: 'Thyroid Function Test',
        orderedBy: 'Dr. James Miller',
        date: '2024-01-16',
        time: '08:45',
        status: 'in_progress',
        priority: 'routine',
        results: 'In Progress',
        department: 'Endocrinology',
        sampleType: 'Blood',
        reportUrl: null
      },
      {
        id: 'LAB005',
        patientId: 'PAT005',
        patientName: 'David Wilson',
        testType: 'Urine Analysis',
        orderedBy: 'Dr. Lisa Anderson',
        date: '2024-01-16',
        time: '09:30',
        status: 'completed',
        priority: 'routine',
        results: 'Normal parameters',
        department: 'Pathology',
        sampleType: 'Urine',
        reportUrl: '/reports/lab005.pdf'
      },
      {
        id: 'LAB006',
        patientId: 'PAT006',
        patientName: 'Sarah Thompson',
        testType: 'MRI Brain Scan',
        orderedBy: 'Dr. Mark Roberts',
        date: '2024-01-17',
        time: '14:00',
        status: 'scheduled',
        priority: 'urgent',
        results: 'Scheduled',
        department: 'Radiology',
        sampleType: 'Imaging',
        reportUrl: null
      },
      {
        id: 'LAB007',
        patientId: 'PAT007',
        patientName: 'Michael Chen',
        testType: 'HbA1c Test',
        orderedBy: 'Dr. Rachel Green',
        date: '2024-01-17',
        time: '10:30',
        status: 'completed',
        priority: 'routine',
        results: '6.8% - Good control',
        department: 'Biochemistry',
        sampleType: 'Blood',
        reportUrl: '/reports/lab007.pdf'
      },
      {
        id: 'LAB008',
        patientId: 'PAT008',
        patientName: 'Emma Rodriguez',
        testType: 'ECG',
        orderedBy: 'Dr. Kevin Park',
        date: '2024-01-18',
        time: '11:15',
        status: 'completed',
        priority: 'stat',
        results: 'Normal sinus rhythm',
        department: 'Cardiology',
        sampleType: 'Cardiac',
        reportUrl: '/reports/lab008.pdf'
      },
      {
        id: 'LAB009',
        patientId: 'PAT009',
        patientName: 'James Wilson',
        testType: 'CT Scan Abdomen',
        orderedBy: 'Dr. Anna Martinez',
        date: '2024-01-18',
        time: '15:30',
        status: 'in_progress',
        priority: 'urgent',
        results: 'In Progress',
        department: 'Radiology',
        sampleType: 'Imaging',
        reportUrl: null
      },
      {
        id: 'LAB010',
        patientId: 'PAT010',
        patientName: 'Lisa Brown',
        testType: 'Liver Function Test',
        orderedBy: 'Dr. Thomas Lee',
        date: '2024-01-19',
        time: '09:00',
        status: 'scheduled',
        priority: 'routine',
        results: 'Scheduled',
        department: 'Biochemistry',
        sampleType: 'Blood',
        reportUrl: null
      }
    ]
    
    setTimeout(() => {
      setLabTests(sampleLabTests)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus
    const matchesDate = test.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'stat': return 'text-red-600 font-bold'
      case 'urgent': return 'text-orange-600 font-semibold'
      case 'routine': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const stats = {
    total: labTests.length,
    completed: labTests.filter(t => t.status === 'completed').length,
    pending: labTests.filter(t => t.status === 'pending').length,
    inProgress: labTests.filter(t => t.status === 'in_progress').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <TestTube className="h-8 w-8 mr-3 text-gray-700" />
          Lab & Diagnostics Management
        </h1>
        <p className="text-gray-600">Manage laboratory tests and diagnostic procedures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <TestTube className="h-8 w-8 text-gray-400" />
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
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
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
              placeholder="Search by patient name, test type, or ID..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Lab Tests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TestTube className="h-5 w-5 mr-2 text-gray-600" />
            Lab Tests & Diagnostics ({filteredTests.length} tests)
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
                    Patient & Test Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule & Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor & Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Results
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test, index) => (
                  <tr key={test.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Patient & Test Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{test.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {test.patientId}</div>
                          <div className="text-xs text-gray-400">Test ID: {test.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Test Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{test.testType}</div>
                      <div className="text-sm text-gray-500">{test.department}</div>
                      <div className="text-xs text-gray-400">Sample: {test.sampleType}</div>
                    </td>

                    {/* Schedule & Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        {new Date(test.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-gray-600" />
                        {test.time}
                      </div>
                      <div className={`text-xs mt-1 ${getPriorityColor(test.priority)}`}>
                        Priority: {test.priority.toUpperCase()}
                      </div>
                    </td>

                    {/* Doctor & Department */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{test.orderedBy}</div>
                      <div className="text-sm text-gray-500">{test.department} Dept.</div>
                    </td>

                    {/* Status & Results */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)} mb-2`}>
                        {getStatusIcon(test.status)}
                        <span className="ml-1 capitalize">{test.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-sm text-gray-600">{test.results}</div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {test.reportUrl && (
                          <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors">
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

        {filteredTests.length === 0 && !loading && (
          <div className="text-center py-12">
            <TestTube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lab tests found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or schedule a new test.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LabDiagnostics
