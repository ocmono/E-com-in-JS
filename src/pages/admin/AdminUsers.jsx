import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { users } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Created At' },
]

export function AdminUsers() {
  return (
    <AdminDataTable
      title="Users & Roles"
      columns={columns}
      data={users}
      schemaNote="DB: id, email, name, role (admin|manager|shop_owner|customer), created_at"
    />
  )
}
