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
  Settings
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
          { path: '/clinics', label: 'Clinics', icon: Building2 },
          { path: '/users', label: 'Users', icon: Users },
          { path: '/patients', label: 'Patients', icon: UserPlus },
          { path: '/billing', label: 'Billing', icon: CreditCard }
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
    <div className="bg-white w-64 shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-primary-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">EMR System</span>
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
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <div className="flex items-center">
          <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar