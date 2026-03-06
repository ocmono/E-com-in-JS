/**
 * Base API client - all API calls go through this.
 */

import { config } from '../config.js'

const BASE_URL = config.api.baseUrl

function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = new Error(res.statusText || 'Request failed')
    err.status = res.status
    err.response = res
    try {
      err.body = await res.json()
    } catch {
      err.body = await res.text()
    }
    throw err
  }

  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
