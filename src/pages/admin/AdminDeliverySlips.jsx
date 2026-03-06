import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { deliverySlips } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'slipNumber', label: 'Slip #' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'carrier', label: 'Carrier' },
  { key: 'trackingNumber', label: 'Tracking #' },
  { key: 'createdAt', label: 'Created At' },
]

export function AdminDeliverySlips() {
  return (
    <AdminDataTable
      title="Delivery Slips"
      columns={columns}
      data={deliverySlips}
      schemaNote="DB: id, slip_number, order_id, carrier, tracking_number, created_at"
    />
  )
}
