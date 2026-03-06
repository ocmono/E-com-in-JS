import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { warehouses } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'address', label: 'Address' },
  { key: 'isDefault', label: 'Default' },
]

export function AdminWarehouses() {
  return (
    <AdminDataTable
      title="Warehouses"
      columns={columns}
      data={warehouses}
      schemaNote="DB: id, name, code, address, is_default"
    />
  )
}
