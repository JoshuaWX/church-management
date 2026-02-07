'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, Calendar, User, X, Search, Mail, Phone } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [newMember, setNewMember] = useState({ name: '', birthday: '', email: '', phone: '' })
  const [editMemberId, setEditMemberId] = useState<number | null>(null)
  const [editMember, setEditMember] = useState({ name: '', birthday: '', email: '', phone: '' })
  const [errorMsg, setErrorMsg] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

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

  useEffect(() => { loadMembers() }, [])

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone?.includes(searchQuery)
  )

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const emailRegex = /^[\w-.]+@[\w.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[+]?\d{10,15}$/
    if (newMember.email && !emailRegex.test(newMember.email)) {
      setErrorMsg('Please enter a valid email address.')
      setIsLoading(false)
      return
    }
    if (newMember.phone && !phoneRegex.test(newMember.phone)) {
      setErrorMsg('Please enter a valid phone number (10-15 digits).')
      setIsLoading(false)
      return
    }
    setErrorMsg('')
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      })
      if (response.ok) {
        setNewMember({ name: '', birthday: '', email: '', phone: '' })
        setShowAddForm(false)
        await loadMembers()
        showNotification('success', 'Member added successfully!')
      } else {
        const data = await response.json()
        showNotification('error', data.error || 'Failed to add member')
      }
    } catch {
      showNotification('error', 'Error adding member')
    } finally {
      setIsLoading(false)
    }
  }

  const startEditMember = (member: Member) => {
    setEditMemberId(member.id)
    setEditMember({
      name: member.name,
      birthday: member.birthday?.split('T')[0] || member.birthday,
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
    if (editMember.email && !emailRegex.test(editMember.email)) {
      setErrorMsg('Please enter a valid email address.')
      setIsLoading(false)
      return
    }
    if (editMember.phone && !phoneRegex.test(editMember.phone)) {
      setErrorMsg('Please enter a valid phone number (10-15 digits).')
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
        showNotification('success', 'Member updated successfully!')
      } else {
        const data = await response.json()
        showNotification('error', data.error || 'Failed to update member')
      }
    } catch {
      showNotification('error', 'Error updating member')
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
        const response = await fetch(`/api/members/${id}`, { method: 'DELETE' })
        if (response.ok) {
          await loadMembers()
          showNotification('success', 'Member deleted')
        } else {
          showNotification('error', 'Failed to delete member')
        }
      } catch {
        showNotification('error', 'Error deleting member')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading && members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3" />
        <span className="text-sm text-gray-500">Loading members...</span>
      </div>
    )
  }

  const MemberForm = ({ data, onChange, onSubmit, onCancel, title }: {
    data: typeof newMember
    onChange: (d: typeof newMember) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    title: string
  }) => (
    <div className="card p-5 sm:p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="input"
              placeholder="e.g. John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday *</label>
            <input
              type="date"
              required
              value={data.birthday}
              onChange={(e) => onChange({ ...data, birthday: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="input"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              className="input"
              placeholder="+234..."
            />
          </div>
        </div>
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700" role="alert">
            {errorMsg}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">
            {title.includes('Edit') ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-right ${
          notification.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => { setShowAddForm(true); setErrorMsg('') }}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <MemberForm
          data={newMember}
          onChange={setNewMember}
          onSubmit={handleAddMember}
          onCancel={() => { setShowAddForm(false); setErrorMsg('') }}
          title="Add New Member"
        />
      )}

      {/* Edit Form */}
      {editMemberId !== null && (
        <MemberForm
          data={editMember}
          onChange={setEditMember}
          onSubmit={handleEditMember}
          onCancel={cancelEdit}
          title="Edit Member"
        />
      )}

      {/* Members Grid */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            All Members
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({filteredMembers.length})
            </span>
          </h3>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center py-12 px-4">
            <User className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No members match your search' : 'No members added yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 sm:px-5 flex items-center gap-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                {/* Avatar */}
                <div className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{member.name}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(member.birthday), 'MMM do, yyyy')}
                    </span>
                    {member.email && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 hidden sm:flex">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                    )}
                    {member.phone && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 hidden sm:flex">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditMember(member)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    aria-label={`Edit ${member.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={`Delete ${member.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
