import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { attributes } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'type', label: 'Type' },
  { key: 'values', label: 'Values', render: (v) => Array.isArray(v) ? v.join(', ') : v },
  { key: 'productCount', label: 'Product Count' },
]

export function AdminAttributes() {
  return (
    <AdminDataTable
      title="Attributes & Features"
      columns={columns}
      data={attributes}
      schemaNote="DB: id, name, slug, type, values (JSON/array), product_count"
    />
  )
}
