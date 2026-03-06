import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { inventory } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'productName', label: 'Product' },
  { key: 'sku', label: 'SKU' },
  { key: 'warehouseId', label: 'Warehouse ID' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'reserved', label: 'Reserved' },
]

export function AdminInventory() {
  return (
    <AdminDataTable
      title="Inventory & Stock"
      columns={columns}
      data={inventory}
      schemaNote="DB: id, product_id, variant_id, warehouse_id, quantity, reserved"
    />
  )
}
