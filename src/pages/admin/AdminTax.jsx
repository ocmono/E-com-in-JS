import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { taxRules } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'rate', label: 'Rate %' },
  { key: 'country', label: 'Country' },
  { key: 'state', label: 'State' },
  { key: 'enabled', label: 'Enabled' },
]

export function AdminTax() {
  return (
    <AdminDataTable
      title="Tax"
      columns={columns}
      data={taxRules}
      schemaNote="DB: id, name, rate, country, state, enabled"
    />
  )
}
