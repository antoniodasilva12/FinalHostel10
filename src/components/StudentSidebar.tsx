import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const StudentSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/student/profile', label: 'My Profile', icon: '👤' },
    { path: '/student/room', label: 'My Room', icon: '🏠' },
    { path: '/student/maintenance', label: 'Maintenance Requests', icon: '🔧' },
    { path: '/student/chatbot', label: 'Chatbot', icon: '🤖' },
    { path: '/student/resources', label: 'Resource Management', icon: '📊' },
    { path: '/student/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/student/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-screen">
      <div className="p-4">
        <div className="text-2xl font-bold mb-8 text-center">Student Portal</div>
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

export default StudentSidebar 