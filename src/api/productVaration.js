/**
 * Product APIs - products, types, variations, attributes, attribute-values.
 * Base: https://bkecom.ocmono.in
 */

import { api } from './client.js'

// ─── Products ─────────────────────────────────────────────────────────────
export async function createProduct(data) {
  return api.post('/products/create', data)
}

export async function listProducts(params = {}) {
  const sp = new URLSearchParams(params)
  const q = sp.toString()
  return api.get(q ? `/products/list?${q}` : '/products/list')
}

export async function getProduct(productId) {
  return api.get(`/products/get/${productId}`)
}

export async function updateProduct(productId, data) {
  return api.put(`/products/update/${productId}`, data)
}

export async function deleteProduct(productId) {
  return api.delete(`/products/delete/${productId}`)
}

// ─── Product Types ────────────────────────────────────────────────────────
export async function createProductType(data) {
  return api.post('/products/types/create', data)
}

export async function listProductTypes(params = {}) {
  const sp = new URLSearchParams(params)
  const q = sp.toString()
  return api.get(q ? `/products/types/list?${q}` : '/products/types/list')
}

export async function getProductType(typeId) {
  return api.get(`/products/types/get/${typeId}`)
}

export async function updateProductType(typeId, data) {
  return api.put(`/products/types/update/${typeId}`, data)
}

export async function deleteProductType(typeId) {
  return api.delete(`/products/types/delete/${typeId}`)
}

// ─── Variations ───────────────────────────────────────────────────────────
export async function createVariation(data) {
  return api.post('/products/variations/create', data)
}

export async function listVariations(params = {}) {
  const sp = new URLSearchParams(params)
  const q = sp.toString()
  return api.get(q ? `/products/variations/list?${q}` : '/products/variations/list')
}

export async function getVariation(variationId) {
  return api.get(`/products/variations/get/${variationId}`)
}

export async function updateVariation(variationId, data) {
  return api.put(`/products/variations/update/${variationId}`, data)
}

export async function deleteVariation(variationId) {
  return api.delete(`/products/variations/delete/${variationId}`)
}

// ─── Attributes ───────────────────────────────────────────────────────────
export async function createAttribute(data) {
  return api.post('/products/attributes/create', data)
}

export async function listAttributes(params = {}) {
  const sp = new URLSearchParams(params)
  const q = sp.toString()
  return api.get(q ? `/products/attributes/list?${q}` : '/products/attributes/list')
}

export async function getAttribute(attributeId) {
  return api.get(`/products/attributes/get/${attributeId}`)
}

export async function updateAttribute(attributeId, data) {
  return api.put(`/products/attributes/update/${attributeId}`, data)
}

export async function deleteAttribute(attributeId) {
  return api.delete(`/products/attributes/delete/${attributeId}`)
}

// ─── Attribute Values ─────────────────────────────────────────────────────
export async function createAttributeValue(data) {
  return api.post('/products/attribute-values/create', data)
}

export async function listAttributeValues(params = {}) {
  const sp = new URLSearchParams(params)
  const q = sp.toString()
  return api.get(q ? `/products/attribute-values/list?${q}` : '/products/attribute-values/list')
}

export async function getAttributeValue(valueId) {
  return api.get(`/products/attribute-values/get/${valueId}`)
}

export async function updateAttributeValue(valueId, data) {
  return api.put(`/products/attribute-values/update/${valueId}`, data)
}

export async function deleteAttributeValue(valueId) {
  return api.delete(`/products/attribute-values/delete/${valueId}`)
}
