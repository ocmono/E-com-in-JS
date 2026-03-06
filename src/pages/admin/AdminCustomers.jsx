import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { customers } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  { key: 'ordersCount', label: 'Orders' },
  { key: 'totalSpent', label: 'Total Spent' },
  { key: 'createdAt', label: 'Created At' },
]

export function AdminCustomers() {
  return (
    <AdminDataTable
      title="Customers"
      columns={columns}
      data={customers}
      schemaNote="DB: id, email, name, orders_count, total_spent, created_at"
    />
  )
}
