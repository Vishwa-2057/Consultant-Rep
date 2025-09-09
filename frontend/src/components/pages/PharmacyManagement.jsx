import React, { useState, useEffect } from 'react'
import { Pill, Search, Filter, Plus, Eye, Edit, Trash2, Package, AlertTriangle, CheckCircle, Calendar, TrendingDown } from 'lucide-react'
import { toast } from 'react-hot-toast'

const PharmacyManagement = () => {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Sample pharmacy data
  useEffect(() => {
    const sampleMedications = [
      {
        id: 'MED001',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        category: 'Antibiotic',
        manufacturer: 'Pfizer Inc.',
        batchNumber: 'AMX2024001',
        expiryDate: '2025-06-15',
        quantity: 250,
        minStock: 50,
        unitPrice: 12.50,
        totalValue: 3125.00,
        status: 'in_stock',
        location: 'Shelf A-12',
        prescriptions: 45
      },
      {
        id: 'MED002',
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        category: 'Pain Relief',
        manufacturer: 'Johnson & Johnson',
        batchNumber: 'IBU2024002',
        expiryDate: '2025-03-20',
        quantity: 15,
        minStock: 30,
        unitPrice: 8.75,
        totalValue: 131.25,
        status: 'low_stock',
        location: 'Shelf B-05',
        prescriptions: 32
      },
      {
        id: 'MED003',
        name: 'Metformin 850mg',
        genericName: 'Metformin HCl',
        category: 'Diabetes',
        manufacturer: 'Novartis',
        batchNumber: 'MET2024003',
        expiryDate: '2024-12-10',
        quantity: 8,
        minStock: 25,
        unitPrice: 15.20,
        totalValue: 121.60,
        status: 'expiring_soon',
        location: 'Shelf C-08',
        prescriptions: 28
      },
      {
        id: 'MED004',
        name: 'Lisinopril 10mg',
        genericName: 'Lisinopril',
        category: 'Cardiovascular',
        manufacturer: 'Merck & Co.',
        batchNumber: 'LIS2024004',
        expiryDate: '2025-09-30',
        quantity: 180,
        minStock: 40,
        unitPrice: 22.00,
        totalValue: 3960.00,
        status: 'in_stock',
        location: 'Shelf D-15',
        prescriptions: 67
      },
      {
        id: 'MED005',
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        category: 'Gastric',
        manufacturer: 'AstraZeneca',
        batchNumber: 'OME2024005',
        expiryDate: '2025-01-25',
        quantity: 0,
        minStock: 35,
        unitPrice: 18.90,
        totalValue: 0.00,
        status: 'out_of_stock',
        location: 'Shelf E-03',
        prescriptions: 23
      },
      {
        id: 'MED006',
        name: 'Atorvastatin 40mg',
        genericName: 'Atorvastatin Calcium',
        category: 'Cholesterol',
        manufacturer: 'Lipitor',
        batchNumber: 'ATO2024006',
        expiryDate: '2025-11-18',
        quantity: 95,
        minStock: 30,
        unitPrice: 28.50,
        totalValue: 2707.50,
        status: 'in_stock',
        location: 'Shelf F-20',
        prescriptions: 41
      }
    ]
    
    setTimeout(() => {
      setMedications(sampleMedications)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || med.category === filterCategory
    const matchesStatus = filterStatus === 'all' || med.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'expiring_soon': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="h-4 w-4" />
      case 'low_stock': return <AlertTriangle className="h-4 w-4" />
      case 'out_of_stock': return <Package className="h-4 w-4" />
      case 'expiring_soon': return <Calendar className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const categories = [...new Set(medications.map(med => med.category))]

  const stats = {
    totalMedications: medications.length,
    inStock: medications.filter(m => m.status === 'in_stock').length,
    lowStock: medications.filter(m => m.status === 'low_stock').length,
    outOfStock: medications.filter(m => m.status === 'out_of_stock').length,
    totalValue: medications.reduce((sum, med) => sum + med.totalValue, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Pill className="h-8 w-8 mr-3 text-gray-700" />
          Pharmacy Management
        </h1>
        <p className="text-gray-600">Manage medication inventory and pharmacy operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Medications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedications}</p>
            </div>
            <Pill className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <Package className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">${stats.totalValue.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-400" />
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
              placeholder="Search by medication name, generic name, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Medication
          </button>
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Pill className="h-5 w-5 mr-2 text-gray-600" />
            Medication Inventory ({filteredMedications.length} medications)
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
                    Medication Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manufacturer & Batch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock & Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing & Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Expiry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.map((medication, index) => (
                  <tr key={medication.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    {/* Medication Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <Pill className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                          <div className="text-sm text-gray-500">{medication.genericName}</div>
                          <div className="text-xs text-gray-400">{medication.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* Manufacturer & Batch */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{medication.manufacturer}</div>
                      <div className="text-sm text-gray-500">Batch: {medication.batchNumber}</div>
                      <div className="text-xs text-gray-400">ID: {medication.id}</div>
                    </td>

                    {/* Stock & Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Qty: {medication.quantity}</div>
                      <div className="text-sm text-gray-500">Min: {medication.minStock}</div>
                      <div className="text-xs text-gray-400">{medication.location}</div>
                      <div className="text-xs text-blue-600">{medication.prescriptions} prescriptions</div>
                    </td>

                    {/* Pricing & Value */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${medication.unitPrice.toFixed(2)}/unit</div>
                      <div className="text-sm text-gray-500">Total: ${medication.totalValue.toFixed(2)}</div>
                    </td>

                    {/* Status & Expiry */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)} mb-2`}>
                        {getStatusIcon(medication.status)}
                        <span className="ml-1 capitalize">{medication.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Exp: {new Date(medication.expiryDate).toLocaleDateString()}
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

        {filteredMedications.length === 0 && !loading && (
          <div className="text-center py-12">
            <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medications found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new medication to inventory.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PharmacyManagement
