import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { creditSlips } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'slipNumber', label: 'Slip #' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'reason', label: 'Reason' },
  { key: 'createdAt', label: 'Created At' },
]

export function AdminCreditSlips() {
  return (
    <AdminDataTable
      title="Credit Slips"
      columns={columns}
      data={creditSlips}
      schemaNote="DB: id, slip_number, order_id, amount, reason, created_at"
    />
  )
}
