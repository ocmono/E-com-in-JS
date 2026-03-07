import { useEffect, useState } from 'react'
import { Table, TableFilterBarWithSearch, TableSearchInput, TableSelect } from '../../components/table'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { fetchAllUser } from '../../api/usersApi.js'
import { formatDateTime } from '../../utils/formatDateTime.jsx'

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
  { key: 'last_login', label: 'Last Login', render: formatDateTime },
  { key: 'created_at', label: 'Created At', render: formatDateTime },
]

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [roleFilter, setRoleFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    fetchAllUser()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data?.users ?? data?.data ?? [])
      })
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [roleFilter, searchQuery])

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
          className="px-4 py-2.5 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          + Add user
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
