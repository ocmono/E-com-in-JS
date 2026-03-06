# Admin Mock Data - Database Design Reference

This folder contains dummy entries for all admin sections. Use them as a reference when designing your database schema.

## Entity Summary

| Entity | Key Fields | Notes |
|--------|------------|-------|
| **categories** | id, name, slug, parent_id, product_count | Hierarchical (parent_id) |
| **product_variations** | id, product_id, sku, attributes (JSON), price, stock | Links to products |
| **attributes** | id, name, slug, type, values (array) | Used for variants |
| **vendors** | id, name, slug, email, product_count | Brands/suppliers |
| **product_types** | id, name, slug, has_variations | Physical, digital, etc. |
| **product_workflow** | id, product_id, state, submitted_at | Draft → approved |
| **orders** | id, order_number, user_id, status, total, created_at | |
| **invoices** | id, invoice_number, order_id, amount, status | Links to orders |
| **credit_slips** | id, slip_number, order_id, amount, reason | Returns/refunds |
| **delivery_slips** | id, slip_number, order_id, carrier, tracking_number | Shipping |
| **shopping_carts** | id, user_id, items (JSON), subtotal | Abandoned carts |
| **customers** | id, email, name, orders_count, total_spent | |
| **inventory** | id, product_id, variant_id, warehouse_id, quantity, reserved | Stock levels |
| **warehouses** | id, name, code, address, is_default | |
| **shipping** | id, name, rate_type, amount, min_order_for_free | |
| **b2b** | id, company_name, tax_id, credit_limit, user_id | B2B customers |
| **users** | id, email, name, role | admin, manager, shop_owner, customer |
| **tax_rules** | id, name, rate, country, state, enabled | |
| **payment_methods** | id, name, code, enabled, is_default | |

## Suggested Tables

- `categories` (self-referential parent_id)
- `products` (category_ids, vendor_id, product_type_id)
- `product_variants` (product_id, sku, attributes JSON)
- `attributes` (name, type, values JSON)
- `orders` → `order_items`
- `invoices` (order_id)
- `inventory` (product_id, variant_id, warehouse_id)
- `users` (role)
