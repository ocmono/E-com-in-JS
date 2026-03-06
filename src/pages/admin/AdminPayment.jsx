import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { paymentMethods } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'enabled', label: 'Enabled' },
  { key: 'isDefault', label: 'Default' },
]

export function AdminPayment() {
  return (
    <AdminDataTable
      title="Payment Methods"
      columns={columns}
      data={paymentMethods}
      schemaNote="DB: id, name, code, enabled, is_default"
    />
  )
}
