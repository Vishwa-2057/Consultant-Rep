import React, { useState, useEffect } from 'react'
import { Building2, Users, DollarSign, Activity } from 'lucide-react'
import { clinicsAPI, usersAPI } from '../../services/api'
import { toast } from 'react-hot-toast'

const SuperMasterAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClinics: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)

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

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : value}
          </p>
        </div>
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
          color="bg-primary-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">New clinic registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">5 new users added</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <span className="text-sm font-medium text-green-600">120ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperMasterAdminDashboard