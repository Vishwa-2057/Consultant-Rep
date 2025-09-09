import React, { useState, useEffect } from 'react'
import { Users, Calendar, DollarSign, UserPlus } from 'lucide-react'
import { usersAPI, appointmentsAPI, patientsAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

const SuperAdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalPatients: 0,
    totalAppointments: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, patientsResponse, appointmentsResponse] = await Promise.all([
          usersAPI.getAll({ clinicId: user.clinicId }),
          patientsAPI.getAll(),
          appointmentsAPI.getAll()
        ])

        if (usersResponse.data.success) {
          setStats(prev => ({
            ...prev,
            totalStaff: usersResponse.data.users.filter(u => u.role !== 'patient').length
          }))
        }

        if (patientsResponse.data.success) {
          setStats(prev => ({
            ...prev,
            totalPatients: patientsResponse.data.patients.length
          }))
        }

        if (appointmentsResponse.data.success) {
          setStats(prev => ({
            ...prev,
            totalAppointments: appointmentsResponse.data.appointments.length
          }))
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.clinicId])

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
        <h1 className="text-3xl font-bold text-gray-900">Clinic Dashboard</h1>
        <p className="text-gray-600">Manage your clinic operations efficiently</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Staff Members"
          value={stats.totalStaff}
          icon={Users}
          color="bg-primary-500"
        />
        <StatCard
          title="Patients"
          value={stats.totalPatients}
          icon={UserPlus}
          color="bg-green-500"
        />
        <StatCard
          title="Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            <div className="text-center text-gray-500 py-8">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No appointments scheduled for today</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary text-left justify-start">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Patient
            </button>
            <button className="w-full btn-secondary text-left justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Staff
            </button>
            <button className="w-full btn-secondary text-left justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard