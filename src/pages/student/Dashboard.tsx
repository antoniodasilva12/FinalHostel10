import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const StudentDashboard = () => {
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
            {isSidebarOpen ? 'Student Portal' : 'SP'}
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
                {isSidebarOpen ? 'My Room' : '🏠'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Maintenance Requests' : '🔧'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Payments' : '💰'}
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50">
                {isSidebarOpen ? 'Profile' : '👤'}
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
          <p className="text-gray-600">Here's your hostel information</p>
        </div>

        {/* Room Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Room</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Room Number</p>
              <p className="text-lg font-semibold">304</p>
            </div>
            <div>
              <p className="text-gray-600">Room Type</p>
              <p className="text-lg font-semibold">Double Sharing</p>
            </div>
            <div>
              <p className="text-gray-600">Check-in Date</p>
              <p className="text-lg font-semibold">01/03/2024</p>
            </div>
            <div>
              <p className="text-gray-600">Next Payment Due</p>
              <p className="text-lg font-semibold text-orange-600">01/04/2024</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Request Maintenance</h3>
            <p className="text-gray-600 mt-2">Report issues with your room</p>
          </button>
          <button className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
            <p className="text-gray-600 mt-2">Pay your hostel fees</p>
          </button>
          <button className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Contact Admin</h3>
            <p className="text-gray-600 mt-2">Get help from hostel staff</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <p className="text-gray-600">Maintenance request completed</p>
              <p className="text-sm text-gray-400">Yesterday</p>
            </div>
            <div className="p-4 border-b">
              <p className="text-gray-600">March rent payment confirmed</p>
              <p className="text-sm text-gray-400">2 days ago</p>
            </div>
            <div className="p-4">
              <p className="text-gray-600">Room cleaning scheduled</p>
              <p className="text-sm text-gray-400">1 week ago</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard 