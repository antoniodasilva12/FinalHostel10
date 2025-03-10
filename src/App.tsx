import { Routes, Route, Navigate, useNavigate, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentManagement from './pages/admin/StudentManagement'
import RoomManagement from './pages/admin/RoomManagement'
import MaintenanceRequests from './pages/admin/MaintenanceRequests'
import Notifications from './pages/admin/Notifications'
import Profile from './pages/student/Profile'
import StudentRoom from './pages/student/Room'
import StudentMaintenanceRequest from './pages/student/MaintenanceRequest'
import ResourceManagement from './pages/student/ResourceManagement'
import Chatbot from './pages/student/Chatbot'
import StudentNotifications from './pages/student/Notifications'
import Settings from './pages/student/Settings'
import AdminLayout from './layouts/AdminLayout'
import StudentLayout from './layouts/StudentLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'

const AppRoutes = () => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="maintenance" element={<MaintenanceRequests />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Protected student routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="room" element={<StudentRoom />} />
        <Route path="maintenance" element={<StudentMaintenanceRequest />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default route - redirect to login if not authenticated */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all other routes and redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

const AuthenticatedContent = () => {
  const navigate = useNavigate()
  return (
    <AuthProvider navigate={navigate}>
      <AppRoutes />
    </AuthProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthenticatedContent />
    </BrowserRouter>
  )
}

export default App 