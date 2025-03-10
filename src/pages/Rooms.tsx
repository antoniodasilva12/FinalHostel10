import React, { useState } from 'react'

interface Room {
  id: number
  number: string
  type: string
  capacity: number
  price: number
  status: 'available' | 'occupied'
}

const Rooms = () => {
  const [rooms] = useState<Room[]>([])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Room
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Room Number</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Capacity</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No rooms available
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-b">
                  <td className="px-6 py-4">{room.number}</td>
                  <td className="px-6 py-4">{room.type}</td>
                  <td className="px-6 py-4">{room.capacity}</td>
                  <td className="px-6 py-4">${room.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        room.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Rooms 