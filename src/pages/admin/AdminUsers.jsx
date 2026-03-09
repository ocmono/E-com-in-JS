import { useEffect, useState } from 'react'
import { Table, TableFilterBarWithSearch, TableSearchInput, TableSelect } from '../../components/table'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import {
  fetchAllUser,
  addUser,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../../api/usersApi.js'
import { formatDateTime } from '../../utils/formatDateTime.jsx'
import { ROLE_OPTIONS, PER_PAGE_OPTIONS } from '../../config.js'

const TABS = [
  { id: 'users', label: 'Users' },
  { id: 'roles', label: 'Roles & permissions' },
  { id: 'policies', label: 'Password policies' },
]

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'full_name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'roles',
    label: 'Roles',
    render: (val) =>
      Array.isArray(val) ? val.map((r) => r.name).join(', ') : '-',
  },
  {
    key: 'is_active',
    label: 'Active',
    render: (val) => (val ? 'Yes' : 'No'),
  },
  { key: 'last_login', label: 'Last Login', render: formatDateTime },
  { key: 'created_at', label: 'Created At', render: formatDateTime },
]

const getRoleColumns = (onEdit, onDelete) => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description' },
  {
    key: 'is_active',
    label: 'Active',
    render: (val) => (val ? 'Yes' : 'No'),
  },
  { key: 'created_at', label: 'Created At', render: formatDateTime },
  { key: 'updated_at', label: 'Updated At', render: formatDateTime },
  {
    key: 'actions',
    label: 'Actions',
    render: (_, row) => (
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(row)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    ),
  },
]

// const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [roleFilter, setRoleFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState(null)
  const [rolesSearchQuery, setRolesSearchQuery] = useState('')
  const [rolesFilter, setRolesFilter] = useState('all')
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [roleForm, setRoleForm] = useState({ name: '', slug: '', description: '', is_active: true })
  const [roleFormSaving, setRoleFormSaving] = useState(false)

  const [userFormOpen, setUserFormOpen] = useState(false)
  const [userForm, setUserForm] = useState({ email: '', full_name: '', phone: '', password: '' })
  const [userFormSaving, setUserFormSaving] = useState(false)
  const [userFormError, setUserFormError] = useState(null)

  const loadUsers = () => {
    setLoading(true)
    setError(null)
    fetchAllUser()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data?.users ?? data?.data ?? [])
      })
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const fetchRoles = () => {
    setRolesLoading(true)
    setRolesError(null)
    listRoles()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.roles ?? data?.data ?? []
        setRoles(list)
      })
      .catch((err) => setRolesError(err.message || 'Failed to load roles'))
      .finally(() => setRolesLoading(false))
  }

  useEffect(() => {
    if (activeTab === 'roles') fetchRoles()
  }, [activeTab])

  useEffect(() => {
    setPage(1)
  }, [roleFilter, searchQuery])

  const filteredRoles = roles
    .filter((r) => {
      if (rolesFilter === 'all') return true
      if (rolesFilter === 'active') return r.is_active === true
      if (rolesFilter === 'inactive') return r.is_active === false
      return true
    })
    .filter((r) => {
      if (!rolesSearchQuery.trim()) return true
      const q = rolesSearchQuery.toLowerCase()
      const name = (r.name ?? '').toLowerCase()
      const slug = (r.slug ?? '').toLowerCase()
      const desc = (r.description ?? '').toLowerCase()
      return name.includes(q) || slug.includes(q) || desc.includes(q)
    })

  const filteredUsers = users
    .filter((u) =>
      roleFilter === 'all'
        ? true
        : (u.roles ?? []).some((r) => r.name === roleFilter || r.slug === roleFilter)
    )
    .filter((u) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const email = (u.email ?? '').toLowerCase()
      const name = (u.full_name ?? '').toLowerCase()
      const phone = (u.phone ?? '').toString()
      return email.includes(q) || name.includes(q) || phone.includes(q)
    })

  const total = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const paginatedUsers = filteredUsers.slice(start, start + perPage)

  const handlePageChange = (newPage) => setPage(Math.max(1, Math.min(newPage, totalPages)))
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  const handleExport = () => {
    const headers = ['ID', 'Email', 'Name', 'Phone', 'Roles', 'Active', 'Last Login', 'Created At']
    const rows = filteredUsers.map((u) => [
      u.id,
      u.email ?? '',
      u.full_name ?? '',
      u.phone ?? '',
      Array.isArray(u.roles) ? u.roles.map((r) => r.name).join(', ') : '',
      u.is_active ? 'Yes' : 'No',
      u.last_login ?? '',
      u.created_at ?? '',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = e.target?.files?.[0]
      if (file) {
        // TODO: implement CSV import logic
        console.log('Import file:', file.name)
      }
    }
    input.click()
  }

  const openRoleForm = (role = null) => {
    if (role) {
      setEditingRole(role)
      setRoleForm({
        name: role.name ?? '',
        slug: role.slug ?? '',
        description: role.description ?? '',
        is_active: role.is_active ?? true,
      })
    } else {
      setEditingRole(null)
      setRoleForm({ name: '', slug: '', description: '', is_active: true })
    }
    setRoleFormOpen(true)
  }

  const closeRoleForm = () => {
    setRoleFormOpen(false)
    setEditingRole(null)
    setRoleForm({ name: '', slug: '', description: '', is_active: true })
  }

  const handleRoleFormSubmit = (e) => {
    e.preventDefault()
    setRoleFormSaving(true)
    const payload = {
      name: roleForm.name.trim(),
      slug: roleForm.slug.trim(),
      description: roleForm.description.trim(),
    }
    if (editingRole) payload.is_active = roleForm.is_active

    const promise = editingRole
      ? updateRole(editingRole.id, payload)
      : createRole(payload)

    promise
      .then(() => {
        closeRoleForm()
        fetchRoles()
      })
      .catch((err) => setRolesError(err.message || 'Failed to save role'))
      .finally(() => setRoleFormSaving(false))
  }

  const handleDeleteRole = (role) => {
    if (!window.confirm(`Delete role "${role.name}"?`)) return
    deleteRole(role.id)
      .then(() => fetchRoles())
      .catch((err) => setRolesError(err.message || 'Failed to delete role'))
  }

  const openUserForm = () => {
    setUserForm({ email: '', full_name: '', phone: '', password: '' })
    setUserFormError(null)
    setUserFormOpen(true)
  }

  const closeUserForm = () => {
    setUserFormOpen(false)
    setUserForm({ email: '', full_name: '', phone: '', password: '' })
    setUserFormError(null)
  }

  const handleUserFormSubmit = (e) => {
    e.preventDefault()
    setUserFormSaving(true)
    setUserFormError(null)
    addUser({
      email: userForm.email.trim(),
      full_name: userForm.full_name.trim(),
      phone: userForm.phone.trim(),
      password: userForm.password,
    })
      .then(() => {
        closeUserForm()
        return fetchAllUser()
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data?.users ?? data?.data ?? [])
      })
      .catch((err) => {
        setUserFormError(err.message || err.body?.message || 'Failed to add user')
      })
      .finally(() => setUserFormSaving(false))
  }

  if (loading) return <div className="p-4">Loading users…</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div>
      <AdminPageHeader
        title="Users, roles & permissions"
        description="Unlimited roles (Admin, Manager, Warehouse, Seller, Finance, Support). Granular permissions for all commerce entities. 2FA, sessions, OAuth, password policies, IP restrictions."
      >
        <button
          type="button"
          onClick={openUserForm}
          className="px-4 py-2.5 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          + Add user
        </button>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </AdminPageHeader>

      <div className="mb-6">
        <div className="flex gap-2 mb-2.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-75rem font-medium rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="h-px bg-neutral-200"
          style={{ boxShadow: '0 1px 1px rgba(0,0,0,0.04)' }}
        />
      </div>

      {activeTab === 'users' && (
        <Table
          columns={columns}
          data={paginatedUsers}
          filterBar={
            <TableFilterBarWithSearch
              export={{ label: 'Export', onClick: handleExport }}
              import={{ label: 'Import', onClick: handleImport }}
              search={
                <TableSearchInput
                  label="Search"
                  placeholder="Search by email, name, or phone..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              }
            >
              <TableSelect
                label="Filter by role"
                value={roleFilter}
                onChange={setRoleFilter}
                options={[{ value: 'all', label: 'All roles' }, ...ROLE_OPTIONS]}
              />
            </TableFilterBarWithSearch>
          }
          emptyState={{
            message: 'No users found',
            subMessage: 'Try adjusting your filter or add a new user to get started.',
          }}
          pagination={{
            page,
            perPage,
            total,
            onPageChange: handlePageChange,
            onPerPageChange: handlePerPageChange,
          }}
          perPageOptions={PER_PAGE_OPTIONS}
        />
      )}
      {activeTab === 'roles' && (
        <>
          {rolesLoading && <div className="p-4">Loading roles…</div>}
          {rolesError && (
            <div className="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">
              {rolesError}
            </div>
          )}
          {!rolesLoading && (
            <Table
              columns={getRoleColumns(openRoleForm, handleDeleteRole)}
              data={filteredRoles}
              filterBar={
                <TableFilterBarWithSearch
                  search={
                    <TableSearchInput
                      label="Search"
                      placeholder="Search by name, slug, or description..."
                      value={rolesSearchQuery}
                      onChange={setRolesSearchQuery}
                    />
                  }
                >
                  <TableSelect
                    label="Filter by status"
                    value={rolesFilter}
                    onChange={setRolesFilter}
                    options={[
                      { value: 'all', label: 'All roles' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={() => openRoleForm()}
                    className="px-4 py-2.5 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  >
                    + Add role
                  </button>
                </TableFilterBarWithSearch>
              }
              emptyState={{
                message: 'No roles found',
                subMessage: 'Try adjusting your search or filter, or add a new role.',
                actionLabel: 'Add role',
                onAction: () => openRoleForm(),
              }}
            />
          )}
          {roleFormOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={closeRoleForm}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {editingRole ? 'Edit role' : 'Add role'}
                </h3>
                <form onSubmit={handleRoleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) =>
                        setRoleForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g. Admin"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={roleForm.slug}
                      onChange={(e) =>
                        setRoleForm((f) => ({ ...f, slug: e.target.value }))
                      }
                      placeholder="e.g. admin"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={roleForm.description}
                      onChange={(e) =>
                        setRoleForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Role description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    />
                  </div>
                  {editingRole && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={roleForm.is_active}
                        onChange={(e) =>
                          setRoleForm((f) => ({
                            ...f,
                            is_active: e.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={roleFormSaving}
                      className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
                    >
                      {roleFormSaving ? 'Saving…' : editingRole ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={closeRoleForm}
                      className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === 'policies' && (
        <div
          className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-neutral-500"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          Password policies — coming soon
        </div>
      )}

      {userFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeUserForm}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Add user</h3>
            {userFormError && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {userFormError}
              </div>
            )}
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={userForm.full_name}
                  onChange={(e) => setUserForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={userFormSaving}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
                >
                  {userFormSaving ? 'Adding…' : 'Add user'}
                </button>
                <button
                  type="button"
                  onClick={closeUserForm}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
