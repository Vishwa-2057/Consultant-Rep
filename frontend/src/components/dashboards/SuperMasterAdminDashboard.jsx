import React, { useState, useEffect } from 'react'
import { Building2, Users, DollarSign, Activity, Calendar, Stethoscope, TestTube, ArrowRightLeft, BarChart3, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react'
import { clinicsAPI, usersAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const SuperMasterAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClinics: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalAppointments: 1247,
    totalDoctors: 89,
    totalLabTests: 523,
    totalReferrals: 156
  })
  const [loading, setLoading] = useState(true)

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, appointments: 120 },
    { month: 'Feb', revenue: 52000, appointments: 140 },
    { month: 'Mar', revenue: 48000, appointments: 135 },
    { month: 'Apr', revenue: 61000, appointments: 165 },
    { month: 'May', revenue: 55000, appointments: 150 },
    { month: 'Jun', revenue: 67000, appointments: 180 }
  ]

  const departmentData = [
    { name: 'Cardiology', value: 30, color: '#3B82F6' },
    { name: 'Neurology', value: 25, color: '#10B981' },
    { name: 'Orthopedics', value: 20, color: '#F59E0B' },
    { name: 'Pediatrics', value: 15, color: '#EF4444' },
    { name: 'Others', value: 10, color: '#8B5CF6' }
  ]

  const activityData = [
    { day: 'Mon', patients: 45, doctors: 12 },
    { day: 'Tue', patients: 52, doctors: 15 },
    { day: 'Wed', patients: 48, doctors: 13 },
    { day: 'Thu', patients: 61, doctors: 16 },
    { day: 'Fri', patients: 55, doctors: 14 },
    { day: 'Sat', patients: 35, doctors: 8 },
    { day: 'Sun', patients: 28, doctors: 6 }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsResponse, usersResponse] = await Promise.all([
          clinicsAPI.getAll(),
          usersAPI.getAll()
        ])

        if (clinicsResponse.data.success) {
          setStats(prev => ({
            ...prev,
            totalClinics: clinicsResponse.data.clinics.length
          }))
        }

        if (usersResponse.data.success) {
          const users = usersResponse.data.users
          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            activeUsers: users.filter(user => user.isActive).length
          }))
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : value}
            </p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Master Admin Dashboard</h1>
        <p className="text-gray-600">Overview of all clinics and system metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clinics"
          value={stats.totalClinics}
          icon={Building2}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          icon={Stethoscope}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Lab Tests"
          value={stats.totalLabTests}
          icon={TestTube}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend="up"
          trendValue="+15%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          trend="up"
          trendValue="+6%"
        />
        <StatCard
          title="Referrals"
          value={stats.totalReferrals}
          icon={ArrowRightLeft}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
          trend="up"
          trendValue="+3%"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          trend="up"
          trendValue="+18%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="bg-gradient-to-br from-red-500 to-red-600"
          trend="up"
          trendValue="+4%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Revenue & Appointments Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Department Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#3B82F6" />
              <Bar dataKey="doctors" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <Building2 className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">New clinic registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <Stethoscope className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">3 new doctors joined</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <TestTube className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">45 lab tests completed</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-red-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Database</span>
              </div>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">API Response</span>
              </div>
              <span className="text-sm font-medium text-green-600">120ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Uptime</span>
              </div>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Storage</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">78% Used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperMasterAdminDashboard