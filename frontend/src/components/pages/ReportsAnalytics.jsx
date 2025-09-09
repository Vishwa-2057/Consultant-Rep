import React, { useState, useEffect } from 'react'
import { BarChart3, Search, Filter, Download, TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  // Sample analytics data
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalPatients: 1247,
      totalAppointments: 856,
      totalRevenue: 125400,
      averageWaitTime: 23,
      patientSatisfaction: 4.6,
      trends: {
        patients: 12.5,
        appointments: 8.3,
        revenue: 15.2,
        satisfaction: 2.1
      }
    },
    monthlyData: [
      { month: 'Jan', patients: 98, appointments: 145, revenue: 18500, satisfaction: 4.2 },
      { month: 'Feb', patients: 112, appointments: 167, revenue: 21200, satisfaction: 4.3 },
      { month: 'Mar', patients: 125, appointments: 189, revenue: 24800, satisfaction: 4.4 },
      { month: 'Apr', patients: 134, appointments: 201, revenue: 26900, satisfaction: 4.5 },
      { month: 'May', patients: 142, appointments: 218, revenue: 29100, satisfaction: 4.6 },
      { month: 'Jun', patients: 156, appointments: 234, revenue: 31500, satisfaction: 4.7 }
    ],
    departmentData: [
      { name: 'Cardiology', patients: 245, revenue: 45600, color: '#8884d8' },
      { name: 'Neurology', patients: 189, revenue: 38200, color: '#82ca9d' },
      { name: 'Pediatrics', patients: 312, revenue: 28900, color: '#ffc658' },
      { name: 'Orthopedics', patients: 156, revenue: 35400, color: '#ff7300' },
      { name: 'Dermatology', patients: 203, revenue: 22800, color: '#00ff88' },
      { name: 'Radiology', patients: 98, revenue: 18500, color: '#ff0088' }
    ],
    appointmentTypes: [
      { name: 'Consultation', value: 45, color: '#8884d8' },
      { name: 'Follow-up', value: 30, color: '#82ca9d' },
      { name: 'Emergency', value: 15, color: '#ffc658' },
      { name: 'Surgery', value: 10, color: '#ff7300' }
    ],
    dailyActivity: [
      { time: '8AM', appointments: 12, patients: 8 },
      { time: '9AM', appointments: 18, patients: 15 },
      { time: '10AM', appointments: 25, patients: 22 },
      { time: '11AM', appointments: 28, patients: 24 },
      { time: '12PM', appointments: 22, patients: 18 },
      { time: '1PM', appointments: 15, patients: 12 },
      { time: '2PM', appointments: 24, patients: 20 },
      { time: '3PM', appointments: 26, patients: 23 },
      { time: '4PM', appointments: 20, patients: 17 },
      { time: '5PM', appointments: 14, patients: 11 }
    ]
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const StatCard = ({ title, value, trend, icon: Icon, color = 'gray' }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}% from last period
            </div>
          )}
        </div>
        <Icon className={`h-8 w-8 text-${color}-400`} />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-gray-700" />
          Reports & Analytics
        </h1>
        <p className="text-gray-600">Comprehensive analytics and reporting dashboard</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="overview">Overview</option>
              <option value="financial">Financial</option>
              <option value="operational">Operational</option>
              <option value="patient">Patient Analytics</option>
            </select>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Patients"
              value={analyticsData.overview.totalPatients.toLocaleString()}
              trend={analyticsData.overview.trends.patients}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Appointments"
              value={analyticsData.overview.totalAppointments.toLocaleString()}
              trend={analyticsData.overview.trends.appointments}
              icon={Calendar}
              color="green"
            />
            <StatCard
              title="Total Revenue"
              value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
              trend={analyticsData.overview.trends.revenue}
              icon={DollarSign}
              color="yellow"
            />
            <StatCard
              title="Avg Wait Time"
              value={`${analyticsData.overview.averageWaitTime} min`}
              trend={-analyticsData.overview.trends.satisfaction}
              icon={Activity}
              color="purple"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="appointments" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Department */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Appointment Types Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.appointmentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.appointmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Pattern</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="appointments" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="patients" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Performance Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Revenue/Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.departmentData.map((dept, index) => (
                    <tr key={dept.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-3`} style={{ backgroundColor: dept.color }}></div>
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.patients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${dept.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Math.round(dept.revenue / dept.patients)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(dept.revenue / 50000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.round((dept.revenue / 50000) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportsAnalytics
