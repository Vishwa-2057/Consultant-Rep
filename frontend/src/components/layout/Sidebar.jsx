import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Heart,
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  Calendar,
  CreditCard,
  Pill,
  FileText,
  Settings,
  Stethoscope,
  TestTube,
  ArrowRightLeft,
  BarChart3,
  Shield,
  HelpCircle,
  Activity
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  const getMenuItems = (role) => {
    const baseItems = [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard }
    ]

    switch (role) {
      case 'super_master_admin':
        return [
          ...baseItems,
          { path: '/clinics', label: 'Clinic Management', icon: Building2 },
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/doctors', label: 'Doctors Management', icon: Stethoscope },
          { path: '/lab-diagnostics', label: 'Lab & Diagnostics', icon: TestTube },
          { path: '/referrals', label: 'Referrals', icon: ArrowRightLeft },
          { path: '/reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
          { path: '/billing-insurance', label: 'Billing & Insurance', icon: CreditCard },
          { path: '/pharmacy', label: 'Pharmacy Management', icon: Pill },
          { path: '/users', label: 'Staff Management', icon: Users },
          { path: '/settings', label: 'Settings', icon: Settings },
          { path: '/support', label: 'Customer Support', icon: HelpCircle }
        ]

      case 'super_admin':
        return [
          ...baseItems,
          { path: '/users', label: 'Staff', icon: Users },
          { path: '/patients', label: 'Patients', icon: UserPlus },
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/billing', label: 'Billing', icon: CreditCard }
        ]

      case 'doctor':
        return [
          ...baseItems,
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/patients', label: 'Patients', icon: UserPlus }
        ]

      case 'nurse':
        return [
          ...baseItems,
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/patients', label: 'Patients', icon: UserPlus }
        ]

      case 'billing_staff':
        return [
          ...baseItems,
          { path: '/billing', label: 'Billing', icon: CreditCard }
        ]

      case 'pharmacy_staff':
        return [
          ...baseItems,
          { path: '/pharmacy', label: 'Pharmacy', icon: Pill }
        ]

      case 'patient':
        return [
          ...baseItems,
          { path: '/appointments', label: 'My Appointments', icon: Calendar },
          { path: '/reports', label: 'Medical Reports', icon: FileText }
        ]

      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems(user?.role)

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 w-64 shadow-lg border-r border-gray-200">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold text-gray-900">Smaart Health Care</span>
            <p className="text-xs text-blue-600 font-medium">Super Master Admin</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-102'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-blue-600 font-medium capitalize bg-blue-100 px-2 py-1 rounded-full">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar