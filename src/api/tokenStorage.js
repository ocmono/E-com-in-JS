/**
 * Token storage - stores access_token in sessionStorage.
 */

const STORAGE_KEY = 'access_token'

export function setToken(data) {
  if (typeof sessionStorage === 'undefined') return
  const token = data.access_token ?? data.token
  if (token) {
    sessionStorage.setItem(STORAGE_KEY, token)
  }
}

export function getToken() {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(STORAGE_KEY)
}

export function clearToken() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}
