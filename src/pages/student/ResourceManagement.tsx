import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import type { ResourceUsage } from '../../lib/supabase'

interface ResourceUsageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { water_usage: number; electricity_usage: number }) => Promise<void>
}

const ResourceUsageModal: React.FC<ResourceUsageModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    water_usage: '',
    electricity_usage: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        water_usage: parseFloat(formData.water_usage),
        electricity_usage: parseFloat(formData.electricity_usage),
      })
      setFormData({ water_usage: '', electricity_usage: '' })
      onClose()
    } catch (error) {
      console.error('Error submitting usage:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Record Resource Usage</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Water Usage (Liters)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.water_usage}
                  onChange={(e) => setFormData({ ...formData, water_usage: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Electricity Usage (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.electricity_usage}
                  onChange={(e) => setFormData({ ...formData, electricity_usage: e.target.value })}
                  min="0"
                />
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
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const ResourceManagement = () => {
  const { profile } = useAuth()
  const [usageData, setUsageData] = useState<ResourceUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('resource_usage')
        .select('*')
        .eq('student_id', profile?.id)
        .order('date', { ascending: false })

      if (error) throw error
      setUsageData(data || [])
    } catch (error) {
      console.error('Error fetching resource usage:', error)
      setError('Failed to load resource usage data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitUsage = async (data: { water_usage: number; electricity_usage: number }) => {
    try {
      const { error } = await supabase.from('resource_usage').insert([
        {
          student_id: profile?.id,
          date: new Date().toISOString().split('T')[0],
          water_usage: data.water_usage,
          electricity_usage: data.electricity_usage,
        },
      ])

      if (error) throw error
      await fetchUsageData()
    } catch (error) {
      console.error('Error submitting resource usage:', error)
      alert('Failed to submit resource usage. Please try again.')
      throw error
    }
  }

  const calculateTotalUsage = () => {
    return usageData.reduce(
      (acc, curr) => ({
        water: acc.water + curr.water_usage,
        electricity: acc.electricity + curr.electricity_usage,
      }),
      { water: 0, electricity: 0 }
    )
  }

  const totals = calculateTotalUsage()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Resource Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Record Usage
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💧</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Water Usage</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {totals.water.toFixed(2)} L
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Electricity Usage
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {totals.electricity.toFixed(2)} kWh
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : usageData.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No resource usage data found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Water Usage (L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Electricity Usage (kWh)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usageData.map((usage) => (
                <tr key={usage.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(usage.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usage.water_usage.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usage.electricity_usage.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ResourceUsageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUsage}
      />
    </div>
  )
}

export default ResourceManagement 