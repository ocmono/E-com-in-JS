/**
 * App configuration - API URL and other settings.
 * Use .env for overrides: VITE_API_URL, VITE_DEMO_MODE, etc.
 */

export const config = {
  api: {
    baseUrl: 'https://bkecom.ocmono.in',
    timeout: 30000,
  },
  app: {
    name: 'OC Mono',
    demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  },
}



export const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'shop_owner', label: 'Shop Owner' },
  { value: 'customer', label: 'Customer' },
]

export const PER_PAGE_OPTIONS = [10, 25, 50, 100]