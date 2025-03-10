import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Room } from '../../lib/supabase'

const StudentRoom = () => {
  const { profile } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoom()
  }, [])

  const fetchRoom = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('student_id', profile?.id)
        .single()

      if (error) throw error
      setRoom(data)
    } catch (error) {
      console.error('Error fetching room:', error)
      setError('Failed to load room information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return 'Single Room'
      case 'double':
        return 'Double Sharing'
      case 'triple':
        return 'Triple Sharing'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="p-6">
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No room assigned yet. Please contact the administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Room</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Room Details</h3>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Room Number</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{room.room_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Room Type</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {getRoomTypeLabel(room.room_type)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Room Rules</h3>
              <div className="mt-5 space-y-4">
                <ul className="list-disc list-inside text-gray-600">
                  <li>Keep your room clean and tidy</li>
                  <li>No smoking inside the room</li>
                  <li>Quiet hours from 10 PM to 6 AM</li>
                  <li>No unauthorized guests allowed</li>
                  <li>Report any maintenance issues promptly</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Room Amenities</h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center space-x-2">
                <span>🛏️</span>
                <span className="text-gray-600">Bed with Mattress</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📚</span>
                <span className="text-gray-600">Study Table</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👕</span>
                <span className="text-gray-600">Wardrobe</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💡</span>
                <span className="text-gray-600">Study Lamp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🪑</span>
                <span className="text-gray-600">Chair</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔌</span>
                <span className="text-gray-600">Power Outlets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRoom 