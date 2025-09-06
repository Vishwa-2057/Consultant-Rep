import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import OTPVerification from './components/auth/OTPVerification'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Dashboard Components
import SuperMasterAdminDashboard from './components/dashboards/SuperMasterAdminDashboard'
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard'
import DoctorDashboard from './components/dashboards/DoctorDashboard'
import NurseDashboard from './components/dashboards/NurseDashboard'
import BillingDashboard from './components/dashboards/BillingDashboard'
import PharmacyDashboard from './components/dashboards/PharmacyDashboard'
import PatientDashboard from './components/dashboards/PatientDashboard'

// Feature Components
import Clinics from './components/clinics/Clinics'
import Users from './components/users/Users'
import Patients from './components/patients/Patients'
import Appointments from './components/appointments/Appointments'
import Billing from './components/billing/Billing'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    )
  }

  const getDashboardComponent = (role) => {
    switch (role) {
      case 'super_master_admin':
        return <SuperMasterAdminDashboard />
      case 'super_admin':
        return <SuperAdminDashboard />
      case 'doctor':
        return <DoctorDashboard />
      case 'nurse':
        return <NurseDashboard />
      case 'billing_staff':
        return <BillingDashboard />
      case 'pharmacy_staff':
        return <PharmacyDashboard />
      case 'patient':
        return <PatientDashboard />
      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={getDashboardComponent(user.role)} />
        <Route path="/dashboard" element={getDashboardComponent(user.role)} />
        
        {/* Admin Routes */}
        {(user.role === 'super_master_admin' || user.role === 'super_admin') && (
          <>
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/billing" element={<Billing />} />
          </>
        )}
        
        {/* Doctor/Nurse Routes */}
        {(user.role === 'doctor' || user.role === 'nurse' || user.role === 'super_admin') && (
          <>
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patients" element={<Patients />} />
          </>
        )}
        
        {/* Billing Staff Routes */}
        {user.role === 'billing_staff' && (
          <Route path="/billing" element={<Billing />} />
        )}
        
        {/* Patient Routes */}
        {user.role === 'patient' && (
          <Route path="/appointments" element={<Appointments />} />
        )}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App