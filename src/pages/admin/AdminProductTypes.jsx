import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { productTypes } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'hasVariations', label: 'Has Variations' },
  { key: 'productCount', label: 'Product Count' },
]

export function AdminProductTypes() {
  return (
    <AdminDataTable
      title="Product Types"
      columns={columns}
      data={productTypes}
      schemaNote="DB: id, name, slug, has_variations, product_count"
    />
  )
}
