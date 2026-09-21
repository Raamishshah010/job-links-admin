import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Messages from './pages/Messages'
import Performance from './pages/Performance'
import Reports from './pages/Reports'
import Workspace from './pages/Workspace'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Feedback from './pages/Feedback'
import Help from './pages/Help'
import Settings from './pages/Settings'
import JobPortalOverview from './pages/JobPortalOverview'
import Companies from './pages/Companies'
import JobListings from './pages/JobListings'
import Advertisements from './pages/Advertisements'
import Subscriptions from './pages/Subscriptions'
import JobSeekers from './pages/JobSeekers'
import NewspaperUploads from './pages/NewspaperUploads'

function LoginRoute() {
  const { isAuthenticated, authLoading } = useAuth()
  if (authLoading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Login />
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LoginRoute />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/job-portal" element={<JobPortalOverview />} />
            <Route path="/job-portal/companies" element={<Companies />} />
            <Route path="/job-portal/jobs" element={<JobListings />} />
            <Route path="/job-portal/ads" element={<Advertisements />} />
            <Route path="/job-portal/subscriptions" element={<Subscriptions />} />
            <Route path="/job-portal/job-seekers" element={<JobSeekers />} />
            <Route path="/job-portal/newspapers" element={<NewspaperUploads />} />
            <Route path="/insights/performance" element={<Performance />} />
            <Route path="/insights/reports" element={<Reports />} />
            <Route path="/workspaces/sales" element={<Workspace type="sales" />} />
            <Route
              path="/workspaces/account-management"
              element={<Workspace type="account" />}
            />
            <Route
              path="/workspaces/support-success"
              element={<Workspace type="support" />}
            />
            <Route path="/workspaces/new" element={<Workspace type="new" />} />
            <Route path="/productivity/tasks" element={<Tasks />} />
            <Route path="/productivity/calendar" element={<Calendar />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App