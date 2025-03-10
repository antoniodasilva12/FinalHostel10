import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../lib/supabase'

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  student?: Profile
  onSubmit: (data: Partial<Profile>) => Promise<void>
  title: string
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, student, onSubmit, title }) => {
  const [formData, setFormData] = useState({
    full_name: student?.full_name || '',
    email: student?.email || '',
    national_id: student?.national_id || '',
    role: 'student' as const,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        email: student.email || '',
        national_id: student.national_id || '',
        role: 'student',
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save student. Please try again.')
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
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.national_id}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Profile | undefined>()
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching students...')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')

      if (error) {
        console.error('Error fetching students:', error)
        setError('Failed to load students. Please try again.')
        return
      }

      console.log('Students fetched:', data)
      setStudents(data || [])
    } catch (error) {
      console.error('Error in fetchStudents:', error)
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEdit = async (data: Partial<Profile>) => {
    try {
      if (modalType === 'add') {
        // For new students, we need to create an auth user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email!,
          password: 'defaultPassword123', // You might want to generate this or ask in the form
          options: {
            data: {
              full_name: data.full_name,
              national_id: data.national_id,
              role: 'student',
            },
          },
        })

        if (authError) throw authError

        // The trigger will create the profile automatically
        await new Promise(resolve => setTimeout(resolve, 1000))
        await fetchStudents()
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            national_id: data.national_id,
          })
          .eq('id', selectedStudent?.id)

        if (error) throw error
        await fetchStudents()
      }
    } catch (error) {
      console.error('Error saving student:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) throw error
      await fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student. Please try again.')
    }
  }

  const openAddModal = () => {
    setModalType('add')
    setSelectedStudent(undefined)
    setModalOpen(true)
  }

  const openEditModal = (student: Profile) => {
    setModalType('edit')
    setSelectedStudent(student)
    setModalOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Student Management</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add New Student
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
      ) : students.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  National ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.national_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openEditModal(student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
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

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        onSubmit={handleAddEdit}
        title={modalType === 'add' ? 'Add New Student' : 'Edit Student'}
      />
    </div>
  )
}

export default StudentManagement 