import { AdminDataTable } from '../../components/admin/AdminDataTable.jsx'
import { b2b } from '../../data/adminMockData.js'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'companyName', label: 'Company' },
  { key: 'taxId', label: 'Tax ID' },
  { key: 'creditLimit', label: 'Credit Limit' },
  { key: 'userId', label: 'User ID' },
]

export function AdminB2B() {
  return (
    <AdminDataTable
      title="B2B"
      columns={columns}
      data={b2b}
      schemaNote="DB: id, company_name, tax_id, credit_limit, user_id"
    />
  )
}
