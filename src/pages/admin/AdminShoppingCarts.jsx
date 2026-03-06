import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { shoppingCarts } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'customerId', label: 'Customer ID' },
  { key: 'email', label: 'Email' },
  { key: 'itemCount', label: 'Items' },
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'lastActive', label: 'Last Active' },
]

export function AdminShoppingCarts() {
  return (
    <AdminDataTable
      title="Shopping Carts"
      columns={columns}
      data={shoppingCarts}
      schemaNote="DB: id, user_id, items (JSON), subtotal, updated_at"
    />
  )
}
