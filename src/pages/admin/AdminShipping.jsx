import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { shipping } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'rateType', label: 'Rate Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'minOrderForFree', label: 'Free Over' },
]

export function AdminShipping() {
  return (
    <AdminDataTable
      title="Shipping"
      columns={columns}
      data={shipping}
      schemaNote="DB: id, name, rate_type, amount, min_order_for_free"
    />
  )
}
