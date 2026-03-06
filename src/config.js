/**
 * App configuration - API URL and other settings.
 * Use .env for overrides: VITE_API_URL, VITE_DEMO_MODE, etc.
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
  },
  app: {
    name: 'OC Mono',
    demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  },
}
