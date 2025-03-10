import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface MaintenanceRequest {
  id: string
  room_number: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  student_name: string
}

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching maintenance requests...')

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          profiles:student_id (full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching maintenance requests:', error)
        setError('Failed to load maintenance requests. Please try again.')
        return
      }

      const formattedRequests = data.map(request => ({
        ...request,
        student_name: request.profiles?.full_name || 'Unknown'
      }))

      console.log('Maintenance requests fetched:', formattedRequests)
      setRequests(formattedRequests)
    } catch (error) {
      console.error('Error in fetchRequests:', error)
      setError('Failed to load maintenance requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await fetchRequests()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Maintenance Requests</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No maintenance requests found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{request.room_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.student_name}</td>
                  <td className="px-6 py-4">{request.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate(request.id, e.target.value as 'pending' | 'in_progress' | 'completed')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MaintenanceRequests 