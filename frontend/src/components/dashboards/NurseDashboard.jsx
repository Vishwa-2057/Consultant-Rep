import React from 'react'
import { Users, Calendar, Activity, Heart } from 'lucide-react'

const NurseDashboard = () => {
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
        <p className="text-gray-600">Patient care and clinical support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patients Assigned"
          value="12"
          icon={Users}
          color="bg-primary-500"
        />
        <StatCard
          title="Vitals Recorded"
          value="8"
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Appointments"
          value="15"
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Medications Given"
          value="6"
          icon={Heart}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Activity className="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Record vital signs for Ward A</p>
                <p className="text-xs text-gray-500">8 patients remaining</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Heart className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Medication rounds</p>
                <p className="text-xs text-gray-500">Due in 30 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary text-left justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Record Vitals
            </button>
            <button className="w-full btn-secondary text-left justify-start">
              <Users className="h-4 w-4 mr-2" />
              Patient Care Plans
            </button>
            <button className="w-full btn-secondary text-left justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Medication Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NurseDashboard