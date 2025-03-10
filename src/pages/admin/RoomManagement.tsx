import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Room {
  id: string
  room_number: string
  room_type: 'single' | 'double' | 'triple'
  is_available: boolean
  student_id: string | null
  student_name?: string
}

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  room?: Room
  onSubmit: (data: Partial<Room>) => Promise<void>
  title: string
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, room, onSubmit, title }) => {
  const [formData, setFormData] = useState({
    room_number: room?.room_number || '',
    room_type: room?.room_type || 'single',
    is_available: room?.is_available ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Number</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.room_type}
                  onChange={(e) =>
                    setFormData({ ...formData, room_type: e.target.value as Room['room_type'] })
                  }
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Available</span>
                </label>
              </div>
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>()
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching rooms...')

      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*, profiles:student_id(full_name)')

      if (roomsError) {
        console.error('Error fetching rooms:', roomsError)
        setError('Failed to load rooms. Please try again.')
        return
      }

      console.log('Rooms fetched:', roomsData)
      const formattedRooms = roomsData.map((room) => ({
        ...room,
        student_name: room.profiles?.full_name,
      }))

      setRooms(formattedRooms)
    } catch (error) {
      console.error('Error in fetchRooms:', error)
      setError('Failed to load rooms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEdit = async (data: Partial<Room>) => {
    try {
      if (modalType === 'add') {
        const { error } = await supabase.from('rooms').insert([{
          room_number: data.room_number,
          room_type: data.room_type,
          is_available: data.is_available,
        }])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('rooms')
          .update({
            room_number: data.room_number,
            room_type: data.room_type,
            is_available: data.is_available,
          })
          .eq('id', selectedRoom?.id)
        if (error) throw error
      }
      await fetchRooms()
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Failed to save room. Please try again.')
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id)
      if (error) throw error
      await fetchRooms()
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room. Please try again.')
    }
  }

  const openAddModal = () => {
    setModalType('add')
    setSelectedRoom(undefined)
    setModalOpen(true)
  }

  const openEditModal = (room: Room) => {
    setModalType('edit')
    setSelectedRoom(room)
    setModalOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add New Room
        </button>
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
      ) : rooms.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No rooms found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{room.room_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{room.room_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.is_available ? 'Available' : 'Occupied'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.student_name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={selectedRoom}
        onSubmit={handleAddEdit}
        title={modalType === 'add' ? 'Add New Room' : 'Edit Room'}
      />
    </div>
  )
}

export default RoomManagement 