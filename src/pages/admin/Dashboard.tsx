import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { signOut, profile } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-blue-600 ${isSidebarOpen ? 'text-2xl' : 'text-xl'}`}>
            {isSidebarOpen ? 'Admin Panel' : 'AP'}
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Dashboard' : '📊'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Manage Rooms' : '🏠'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Manage Students' : '👥'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Bookings' : '📅'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Payments' : '💰'}
              </a>
            </li>
            <li>
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                {isSidebarOpen ? 'Sign Out' : '🚪'}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.full_name}</h1>
          <p className="text-gray-600">Here's what's happening in your hostel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Summary Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Rooms</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Occupied Rooms</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">18</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Students</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">36</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Monthly Revenue</h2>
            <p className="text-3xl font-bold text-orange-600 mt-2">$12,400</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <p className="text-gray-600">New booking request from John Doe</p>
              <p className="text-sm text-gray-400">2 minutes ago</p>
            </div>
            <div className="p-4 border-b">
              <p className="text-gray-600">Payment received from Jane Smith</p>
              <p className="text-sm text-gray-400">1 hour ago</p>
            </div>
            <div className="p-4">
              <p className="text-gray-600">Room 304 maintenance request</p>
              <p className="text-sm text-gray-400">3 hours ago</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard 