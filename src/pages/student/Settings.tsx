import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const Settings = () => {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    maintenanceUpdates: true,
    paymentReminders: true,
    resourceUsageAlerts: true,
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      })

      if (error) throw error

      setSuccess('Password updated successfully')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error updating password:', error)
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesChange = async (key: keyof typeof preferences) => {
    try {
      setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
      // Here you would typically save the preferences to your database
      // For now, we'll just simulate success
      console.log('Preferences updated:', { ...preferences, [key]: !preferences[key] })
    } catch (error) {
      console.error('Error updating preferences:', error)
      alert('Failed to update preferences. Please try again.')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Ensure your account is using a long, random password to stay secure.</p>
            </div>

            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {success}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Choose what notifications you want to receive.</p>
            </div>
            <div className="mt-5 space-y-4">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handlePreferencesChange('emailNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-gray-500">Receive notifications via email.</p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="maintenance-updates"
                    type="checkbox"
                    checked={preferences.maintenanceUpdates}
                    onChange={() => handlePreferencesChange('maintenanceUpdates')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="maintenance-updates" className="font-medium text-gray-700">
                    Maintenance Updates
                  </label>
                  <p className="text-gray-500">Get updates about maintenance requests.</p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="payment-reminders"
                    type="checkbox"
                    checked={preferences.paymentReminders}
                    onChange={() => handlePreferencesChange('paymentReminders')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="payment-reminders" className="font-medium text-gray-700">
                    Payment Reminders
                  </label>
                  <p className="text-gray-500">Receive reminders about upcoming payments.</p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="resource-alerts"
                    type="checkbox"
                    checked={preferences.resourceUsageAlerts}
                    onChange={() => handlePreferencesChange('resourceUsageAlerts')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="resource-alerts" className="font-medium text-gray-700">
                    Resource Usage Alerts
                  </label>
                  <p className="text-gray-500">Get alerts about your resource usage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 