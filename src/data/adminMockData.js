/**
 * Dummy entries for all admin sections - use as reference for database design.
 * Each entity shows the fields/columns you'd typically have in your DB schema.
 */

export const categories = [
  { id: 'cat1', name: 'Apparel', slug: 'apparel', parentId: null, productCount: 12 },
  { id: 'cat2', name: 'Electronics', slug: 'electronics', parentId: null, productCount: 8 },
  { id: 'cat3', name: 'T-Shirts', slug: 't-shirts', parentId: 'cat1', productCount: 5 },
]

export const productVariations = [
  { id: 'pv1', productId: 'd1', productName: 'Classic Cotton T-Shirt', sku: 'TSH-BLK-S', attributes: { Size: 'S', Color: 'Black' }, price: 24.99, stock: 50 },
  { id: 'pv2', productId: 'd1', productName: 'Classic Cotton T-Shirt', sku: 'TSH-BLK-M', attributes: { Size: 'M', Color: 'Black' }, price: 24.99, stock: 80 },
  { id: 'pv3', productId: 'd2', productName: 'Premium Wireless Earbuds', sku: 'EARB-BLK', attributes: { Color: 'Black' }, price: 89.99, stock: 100 },
]

export const attributes = [
  { id: 'attr1', name: 'Size', slug: 'size', type: 'select', values: ['XS', 'S', 'M', 'L', 'XL'], productCount: 15 },
  { id: 'attr2', name: 'Color', slug: 'color', type: 'select', values: ['Black', 'White', 'Blue', 'Red'], productCount: 22 },
  { id: 'attr3', name: 'Material', slug: 'material', type: 'text', values: [], productCount: 8 },
]

export const vendors = [
  { id: 'v1', name: 'Acme Supplies', slug: 'acme-supplies', email: 'orders@acme.com', productCount: 5 },
  { id: 'v2', name: 'TechBrand Inc', slug: 'techbrand-inc', email: 'vendor@techbrand.com', productCount: 3 },
]

export const productTypes = [
  { id: 'pt1', name: 'Physical', slug: 'physical', hasVariations: true, productCount: 18 },
  { id: 'pt2', name: 'Digital', slug: 'digital', hasVariations: false, productCount: 4 },
]

export const productWorkflow = [
  { id: 'w1', productId: 'd1', productName: 'Classic Cotton T-Shirt', state: 'approved', submittedAt: '2025-03-01T10:00:00Z' },
  { id: 'w2', productId: 'd2', productName: 'Premium Wireless Earbuds', state: 'draft', submittedAt: null },
]

export const monitoring = [
  { type: 'empty_categories', count: 2, items: ['Gadgets', 'Accessories'] },
  { type: 'products_no_stock', count: 1, items: ['Old Widget'] },
]

export const orders = [
  { id: 'ord1', orderNumber: 'ORD-1001', customer: 'john@example.com', status: 'shipped', total: 114.98, createdAt: '2025-03-05T14:30:00Z' },
  { id: 'ord2', orderNumber: 'ORD-1002', customer: 'jane@example.com', status: 'processing', total: 89.99, createdAt: '2025-03-06T09:15:00Z' },
  { id: 'ord3', orderNumber: 'ORD-1003', customer: 'bob@example.com', status: 'pending', total: 24.99, createdAt: '2025-03-06T11:00:00Z' },
]

export const invoices = [
  { id: 'inv1', invoiceNumber: 'INV-1001', orderId: 'ord1', amount: 114.98, status: 'paid', createdAt: '2025-03-05T15:00:00Z' },
  { id: 'inv2', invoiceNumber: 'INV-1002', orderId: 'ord2', amount: 89.99, status: 'pending', createdAt: '2025-03-06T09:30:00Z' },
]

export const creditSlips = [
  { id: 'cs1', slipNumber: 'CS-001', orderId: 'ord1', amount: 24.99, reason: 'Customer return', createdAt: '2025-03-04T10:00:00Z' },
]

export const deliverySlips = [
  { id: 'ds1', slipNumber: 'DS-1001', orderId: 'ord1', carrier: 'FedEx', trackingNumber: '1Z999AA10123456784', createdAt: '2025-03-05T16:00:00Z' },
]

export const shoppingCarts = [
  { id: 'cart1', customerId: 'u1', email: 'guest@example.com', itemCount: 3, subtotal: 134.97, lastActive: '2025-03-06T10:30:00Z' },
  { id: 'cart2', customerId: null, email: null, itemCount: 1, subtotal: 24.99, lastActive: '2025-03-06T09:00:00Z' },
]

export const customers = [
  { id: 'c1', email: 'john@example.com', name: 'John Doe', ordersCount: 5, totalSpent: 450.00, createdAt: '2024-01-15' },
  { id: 'c2', email: 'jane@example.com', name: 'Jane Smith', ordersCount: 2, totalSpent: 189.98, createdAt: '2025-02-20' },
]

export const inventory = [
  { id: 'inv1', productId: 'd1', productName: 'Classic Cotton T-Shirt', sku: 'TSH-BLK-S', warehouseId: 'wh1', quantity: 50, reserved: 2 },
  { id: 'inv2', productId: 'd2', productName: 'Premium Wireless Earbuds', sku: 'EARB-BLK', warehouseId: 'wh1', quantity: 100, reserved: 0 },
]

export const warehouses = [
  { id: 'wh1', name: 'Main Warehouse', code: 'WH-MAIN', address: '123 Storage St', isDefault: true },
  { id: 'wh2', name: 'East Coast Hub', code: 'WH-EAST', address: '456 Distribution Ave', isDefault: false },
]

export const shipping = [
  { id: 'ship1', name: 'Standard Shipping', rateType: 'flat', amount: 5.99, minOrderForFree: 50 },
  { id: 'ship2', name: 'Express', rateType: 'flat', amount: 12.99, minOrderForFree: null },
]

export const b2b = [
  { id: 'b1', companyName: 'Acme Corp', taxId: '12-3456789', creditLimit: 10000, userId: 'c1' },
]

export const users = [
  { id: 'u1', email: 'admin@example.com', name: 'Admin User', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u2', email: 'manager@example.com', name: 'Store Manager', role: 'manager', createdAt: '2024-06-15' },
  { id: 'u3', email: 'shop@example.com', name: 'Shop Owner', role: 'shop_owner', createdAt: '2025-01-10' },
]

export const taxRules = [
  { id: 'tax1', name: 'Standard VAT', rate: 10, country: 'US', state: null, enabled: true },
  { id: 'tax2', name: 'CA State Tax', rate: 7.25, country: 'US', state: 'CA', enabled: true },
]

export const paymentMethods = [
  { id: 'pm1', name: 'Credit Card', code: 'stripe', enabled: true, isDefault: true },
  { id: 'pm2', name: 'PayPal', code: 'paypal', enabled: true, isDefault: false },
  { id: 'pm3', name: 'Bank Transfer', code: 'bank', enabled: false, isDefault: false },
]
