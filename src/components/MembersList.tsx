'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react'

interface Member {
  id: number
  name: string
  email?: string
  phone?: string
  birthday: string
  picture?: string
}

export function MembersList() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    birthday: '',
    email: '',
    phone: ''
  })
  const [editMemberId, setEditMemberId] = useState<number | null>(null)
  const [editMember, setEditMember] = useState({ name: '', birthday: '', email: '', phone: '' })
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Load members from database
  const loadMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  // Validation and duplicate prevention for add
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const emailRegex = /^[\w-.]+@[\w.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[+]?\d{10,15}$/
    if (!emailRegex.test(newMember.email)) {
      setErrorMsg('Please enter a valid email address.')
      setIsLoading(false)
      return
    }
    if (!phoneRegex.test(newMember.phone)) {
      setErrorMsg('Please enter a valid phone number (10-15 digits).')
      setIsLoading(false)
      return
    }
    const duplicate = members.some(m => m.name === newMember.name || m.email === newMember.email || m.phone === newMember.phone)
    if (duplicate) {
      setErrorMsg('A member with this name, email, or phone already exists.')
      setIsLoading(false)
      return
    }
    setErrorMsg('')
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember)
      })

      if (response.ok) {
        setNewMember({ name: '', birthday: '', email: '', phone: '' })
        setShowAddForm(false)
        await loadMembers() // Refresh the list
        alert('Member added successfully!')
      } else {
        alert('Failed to add member')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Error adding member')
    } finally {
      setIsLoading(false)
    }
  }

  // Edit member handlers
  const startEditMember = (member: Member) => {
    setEditMemberId(member.id)
    setEditMember({
      name: member.name,
      birthday: member.birthday,
      email: member.email || '',
      phone: member.phone || ''
    })
    setErrorMsg('')
  }
  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const emailRegex = /^[\w-.]+@[\w.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[+]?\d{10,15}$/
    if (!emailRegex.test(editMember.email)) {
      setErrorMsg('Please enter a valid email address.')
      setIsLoading(false)
      return
    }
    if (!phoneRegex.test(editMember.phone)) {
      setErrorMsg('Please enter a valid phone number (10-15 digits).')
      setIsLoading(false)
      return
    }
    const duplicate = members.some(m => (m.id !== editMemberId) && (m.name === editMember.name || m.email === editMember.email || m.phone === editMember.phone))
    if (duplicate) {
      setErrorMsg('A member with this name, email, or phone already exists.')
      setIsLoading(false)
      return
    }
    setErrorMsg('')
    try {
      const response = await fetch(`/api/members/${editMemberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMember)
      })
      if (response.ok) {
        setEditMemberId(null)
        setEditMember({ name: '', birthday: '', email: '', phone: '' })
        await loadMembers()
        alert('Member updated successfully!')
      } else {
        alert('Failed to update member')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Error updating member')
    } finally {
      setIsLoading(false)
    }
  }
  const cancelEdit = () => {
    setEditMemberId(null)
    setEditMember({ name: '', birthday: '', email: '', phone: '' })
    setErrorMsg('')
  }

  const handleDeleteMember = async (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/members/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadMembers() // Refresh the list
          alert('Member deleted successfully!')
        } else {
          alert('Failed to delete member')
        }
      } catch (error) {
        console.error('Error deleting member:', error)
        alert('Error deleting member')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading && members.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading members...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Member Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  required
                  value={newMember.birthday}
                  onChange={(e) => setNewMember({ ...newMember, birthday: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Member Form */}
      {editMemberId !== null && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Member</h3>
          <form onSubmit={handleEditMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editMember.name}
                  onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  required
                  value={editMember.birthday}
                  onChange={(e) => setEditMember({ ...editMember, birthday: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editMember.email}
                  onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editMember.phone}
                  onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={cancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Church Members</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Birthday: {format(new Date(member.birthday), 'MMMM do, yyyy')}
                  </div>
                  {member.email && (
                    <p className="text-sm text-gray-500">📧 {member.email}</p>
                  )}
                  {member.phone && (
                    <p className="text-sm text-gray-500">📞 {member.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => startEditMember(member)}>
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
