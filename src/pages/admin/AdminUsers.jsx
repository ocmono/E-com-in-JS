import { useEffect, useState } from 'react'
import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { fetchAllUser } from '../../api/usersApi.js'

const TABS = [
  { id: 'users', label: 'Users' },
  { id: 'roles', label: 'Roles & permissions' },
  { id: 'policies', label: 'Password policies' },
]

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'shop_owner', label: 'Shop Owner' },
  { value: 'customer', label: 'Customer' },
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
  { key: 'last_login', label: 'Last Login' },
  { key: 'created_at', label: 'Created At' },
]

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchAllUser()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data?.users ?? data?.data ?? [])
      })
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((u) =>
          (u.roles ?? []).some((r) => r.name === roleFilter || r.slug === roleFilter)
        )

  if (loading) return <div className="p-4">Loading users…</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Users, roles & permissions
      </h1>
      <p className="text-sm text-neutral-500 mb-6">
        Unlimited roles (Admin, Manager, Warehouse, Seller, Finance, Support).
        Granular permissions for all commerce entities. 2FA, sessions, OAuth,
        password policies, IP restrictions.
      </p>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
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
        <AdminDataTable
          columns={columns}
          data={filteredUsers}
          subheading="Users"
          filterLabel="Filter by role"
          filterOptions={ROLE_OPTIONS}
          filterValue={roleFilter}
          onFilterChange={setRoleFilter}
        />
      )}
      {activeTab === 'roles' && (
        <div
          className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-neutral-500"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          Roles & permissions configuration — coming soon
        </div>
      )}
      {activeTab === 'policies' && (
        <div
          className="bg-white border border-neutral-200 rounded-lg p-8 text-center text-neutral-500"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          Password policies — coming soon
        </div>
      )}
    </div>
  )
}
