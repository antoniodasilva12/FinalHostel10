import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  created_at: string
  is_read: boolean
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching notifications...')

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        setError('Failed to load notifications. Please try again.')
        return
      }

      console.log('Notifications fetched:', data)
      setNotifications(data || [])
    } catch (error) {
      console.error('Error in fetchNotifications:', error)
      setError('Failed to load notifications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      alert('Failed to update notification. Please try again.')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ℹ️'
      case 'warning':
        return '⚠️'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
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
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                notification.is_read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications 