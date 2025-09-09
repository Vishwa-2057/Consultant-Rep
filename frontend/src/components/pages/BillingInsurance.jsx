import React, { useState, useEffect } from 'react'
import { CreditCard, Search, Filter, Plus, Eye, Edit, Download, DollarSign, FileText, Calendar, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

const BillingInsurance = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Sample billing data
  useEffect(() => {
    const sampleBills = [
      {
        id: 'BILL001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        invoiceNumber: 'INV-2024-001',
        amount: 1250.00,
        insuranceAmount: 875.00,
        patientAmount: 375.00,
        status: 'paid',
        billDate: '2024-01-15',
        dueDate: '2024-02-15',
        paidDate: '2024-01-20',
        insuranceProvider: 'Blue Cross Blue Shield',
        policyNumber: 'BCBS123456789',
        services: ['Consultation', 'Blood Test', 'X-Ray'],
        type: 'insurance'
      },
      {
        id: 'BILL002',
        patientId: 'PAT002',
        patientName: 'Jane Smith',
        invoiceNumber: 'INV-2024-002',
        amount: 850.00,
        insuranceAmount: 0.00,
        patientAmount: 850.00,
        status: 'pending',
        billDate: '2024-01-16',
        dueDate: '2024-02-16',
        paidDate: null,
        insuranceProvider: null,
        policyNumber: null,
        services: ['Emergency Visit', 'CT Scan'],
        type: 'self_pay'
      },
      {
        id: 'BILL003',
        patientId: 'PAT003',
        patientName: 'Robert Johnson',
        invoiceNumber: 'INV-2024-003',
        amount: 2100.00,
        insuranceAmount: 1680.00,
        patientAmount: 420.00,
        status: 'partially_paid',
        billDate: '2024-01-17',
        dueDate: '2024-02-17',
        paidDate: null,
        insuranceProvider: 'Aetna',
        policyNumber: 'AET987654321',
        services: ['Surgery', 'Anesthesia', 'Post-op Care'],
        type: 'insurance'
      },
      {
        id: 'BILL004',
        patientId: 'PAT004',
        patientName: 'Maria Garcia',
        invoiceNumber: 'INV-2024-004',
        amount: 450.00,
        insuranceAmount: 360.00,
        patientAmount: 90.00,
        status: 'overdue',
        billDate: '2024-01-10',
        dueDate: '2024-02-10',
        paidDate: null,
        insuranceProvider: 'Medicare',
        policyNumber: 'MED456789123',
        services: ['Follow-up Visit', 'Prescription'],
        type: 'insurance'
      },
      {
        id: 'BILL005',
        patientId: 'PAT005',
        patientName: 'David Wilson',
        invoiceNumber: 'INV-2024-005',
        amount: 750.00,
        insuranceAmount: 0.00,
        patientAmount: 750.00,
        status: 'paid',
        billDate: '2024-01-18',
        dueDate: '2024-02-18',
        paidDate: '2024-01-25',
        insuranceProvider: null,
        policyNumber: null,
        services: ['Dental Cleaning', 'Filling'],
        type: 'self_pay'
      },
      {
        id: 'BILL006',
        patientId: 'PAT006',
        patientName: 'Sarah Thompson',
        invoiceNumber: 'INV-2024-006',
        amount: 1800.00,
        insuranceAmount: 1440.00,
        patientAmount: 360.00,
        status: 'processing',
        billDate: '2024-01-19',
        dueDate: '2024-02-19',
        paidDate: null,
        insuranceProvider: 'Cigna',
        policyNumber: 'CIG789123456',
        services: ['MRI Scan', 'Consultation', 'Lab Tests'],
        type: 'insurance'
      }
    ]
    
    setTimeout(() => {
      setBills(sampleBills)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus
    const matchesType = filterType === 'all' || bill.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'partially_paid': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'partially_paid': return <AlertCircle className="h-4 w-4" />
      case 'overdue': return <XCircle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const stats = {
    totalBills: bills.length,
    totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
    paidAmount: bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0),
    pendingAmount: bills.filter(b => b.status !== 'paid').reduce((sum, bill) => sum + bill.amount, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <CreditCard className="h-8 w-8 mr-3 text-gray-700" />
          Billing & Insurance Management
        </h1>
        <p className="text-gray-600">Manage patient billing, insurance claims, and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">${stats.paidAmount.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-orange-600">${stats.pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
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
              placeholder="Search by patient name, invoice number, or ID..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
            <option value="processing">Processing</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Types</option>
            <option value="insurance">Insurance</option>
            <option value="self_pay">Self Pay</option>
          </select>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Bill
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
            Bills & Insurance Claims ({filteredBills.length} bills)
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
                    Patient & Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Breakdown
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insurance Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Services
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill, index) => (
                  <tr key={bill.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Patient & Invoice */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {bill.patientId}</div>
                          <div className="text-xs text-gray-400">{bill.invoiceNumber}</div>
                        </div>
                      </div>
                    </td>

                    {/* Amount Breakdown */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">Total: ${bill.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Insurance: ${bill.insuranceAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Patient: ${bill.patientAmount.toFixed(2)}</div>
                    </td>

                    {/* Insurance Details */}
                    <td className="px-6 py-4">
                      {bill.insuranceProvider ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">{bill.insuranceProvider}</div>
                          <div className="text-sm text-gray-500">{bill.policyNumber}</div>
                          <div className={`text-xs mt-1 ${bill.type === 'insurance' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {bill.type === 'insurance' ? 'INSURANCE' : 'SELF PAY'}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Self Pay</div>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        Bill: {new Date(bill.billDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </div>
                      {bill.paidDate && (
                        <div className="text-sm text-green-600 flex items-center mt-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Paid: {new Date(bill.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Status & Services */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)} mb-2`}>
                        {getStatusIcon(bill.status)}
                        <span className="ml-1 capitalize">{bill.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {bill.services.join(', ')}
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
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBills.length === 0 && !loading && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new bill.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BillingInsurance
