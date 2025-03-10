import React from 'react'
import { Outlet } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import { useAuth } from '../context/AuthContext'

const StudentLayout = () => {
  const { profile } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Welcome, {profile?.full_name}
                </h2>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentLayout 