import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true
    if (path === '/admin/students' && (location.pathname === '/admin' || location.pathname === '/admin/students')) return true
    return location.pathname === path
  }

  const navItems = [
    { path: '/admin/students', label: 'Student Management', icon: '👥' },
    { path: '/admin/rooms', label: 'Room Management', icon: '🏠' },
    { path: '/admin/maintenance', label: 'Maintenance Requests', icon: '🔧' },
    { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-screen">
      <div className="p-4">
        <div className="text-2xl font-bold mb-8 text-center">Admin Panel</div>
        <nav className="space-y-2 overflow-y-auto flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar 