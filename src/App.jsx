import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout.jsx'
import { Spinner } from './components/Spinner.jsx'
import { useAuthStore } from './stores/authStore.js'

// Lazy load all pages
const Home = lazy(() => import('./pages/Home.jsx').then((m) => ({ default: m.Home })))
const Catalog = lazy(() => import('./pages/Catalog.jsx').then((m) => ({ default: m.Catalog })))
const Cart = lazy(() => import('./pages/Cart.jsx').then((m) => ({ default: m.Cart })))
const Login = lazy(() => import('./pages/Login.jsx').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Register.jsx').then((m) => ({ default: m.Register })))
const Blog = lazy(() => import('./pages/Blog.jsx').then((m) => ({ default: m.Blog })))
const Account = lazy(() => import('./pages/Account.jsx').then((m) => ({ default: m.Account })))
const Orders = lazy(() => import('./pages/Orders.jsx').then((m) => ({ default: m.Orders })))
const Checkout = lazy(() => import('./pages/Checkout.jsx').then((m) => ({ default: m.Checkout })))
const Product = lazy(() => import('./pages/Product.jsx').then((m) => ({ default: m.Product })))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx').then((m) => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx').then((m) => ({ default: m.AdminProducts })))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm.jsx').then((m) => ({ default: m.AdminProductForm })))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx').then((m) => ({ default: m.AdminCategories })))
const AdminProductVariations = lazy(() => import('./pages/admin/AdminProductVariations.jsx').then((m) => ({ default: m.AdminProductVariations })))
const AdminAttributes = lazy(() => import('./pages/admin/AdminAttributes.jsx').then((m) => ({ default: m.AdminAttributes })))
const AdminVendors = lazy(() => import('./pages/admin/AdminVendors.jsx').then((m) => ({ default: m.AdminVendors })))
const AdminProductTypes = lazy(() => import('./pages/admin/AdminProductTypes.jsx').then((m) => ({ default: m.AdminProductTypes })))
const AdminProductWorkflow = lazy(() => import('./pages/admin/AdminProductWorkflow.jsx').then((m) => ({ default: m.AdminProductWorkflow })))
const AdminMonitoring = lazy(() => import('./pages/admin/AdminMonitoring.jsx').then((m) => ({ default: m.AdminMonitoring })))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx').then((m) => ({ default: m.AdminOrders })))
const AdminInvoices = lazy(() => import('./pages/admin/AdminInvoices.jsx').then((m) => ({ default: m.AdminInvoices })))
const AdminCreditSlips = lazy(() => import('./pages/admin/AdminCreditSlips.jsx').then((m) => ({ default: m.AdminCreditSlips })))
const AdminDeliverySlips = lazy(() => import('./pages/admin/AdminDeliverySlips.jsx').then((m) => ({ default: m.AdminDeliverySlips })))
const AdminShoppingCarts = lazy(() => import('./pages/admin/AdminShoppingCarts.jsx').then((m) => ({ default: m.AdminShoppingCarts })))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers.jsx').then((m) => ({ default: m.AdminCustomers })))
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory.jsx').then((m) => ({ default: m.AdminInventory })))
const AdminWarehouses = lazy(() => import('./pages/admin/AdminWarehouses.jsx').then((m) => ({ default: m.AdminWarehouses })))
const AdminShipping = lazy(() => import('./pages/admin/AdminShipping.jsx').then((m) => ({ default: m.AdminShipping })))
const AdminB2B = lazy(() => import('./pages/admin/AdminB2B.jsx').then((m) => ({ default: m.AdminB2B })))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx').then((m) => ({ default: m.AdminUsers })))
const AdminTax = lazy(() => import('./pages/admin/AdminTax.jsx').then((m) => ({ default: m.AdminTax })))
const AdminPayment = lazy(() => import('./pages/admin/AdminPayment.jsx').then((m) => ({ default: m.AdminPayment })))
const AdminPlaceholder = lazy(() => import('./pages/admin/AdminPlaceholder.jsx').then((m) => ({ default: m.AdminPlaceholder })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
})

function AppRoutes() {
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Suspense fallback={<Spinner />}><Home /></Suspense>} />
        <Route path="catalog" element={<Suspense fallback={<Spinner />}><Catalog /></Suspense>} />
        <Route path="product/:slug" element={<Suspense fallback={<Spinner />}><Product /></Suspense>} />
        <Route path="cart" element={<Suspense fallback={<Spinner />}><Cart /></Suspense>} />
        <Route path="checkout" element={<Suspense fallback={<Spinner />}><Checkout /></Suspense>} />
        <Route path="login" element={<Suspense fallback={<Spinner />}><Login /></Suspense>} />
        <Route path="register" element={<Suspense fallback={<Spinner />}><Register /></Suspense>} />
        <Route path="blog" element={<Suspense fallback={<Spinner />}><Blog /></Suspense>} />
        <Route path="account" element={<Suspense fallback={<Spinner />}><Account /></Suspense>} />
        <Route path="account/orders" element={<Suspense fallback={<Spinner />}><Orders /></Suspense>} />
        <Route path="privacy" element={<div className="max-w-2xl mx-auto px-4 py-16"><h1 className="text-2xl font-bold">Privacy</h1><p className="text-neutral-500">Placeholder.</p></div>} />
        <Route path="terms" element={<div className="max-w-2xl mx-auto px-4 py-16"><h1 className="text-2xl font-bold">Terms</h1><p className="text-neutral-500">Placeholder.</p></div>} />
      </Route>
      <Route path="/admin" element={<Suspense fallback={<Spinner />}><AdminLayout /></Suspense>}>
        <Route index element={<Suspense fallback={<Spinner />}><AdminDashboard /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<Spinner />}><AdminProducts /></Suspense>} />
        <Route path="products/new" element={<Suspense fallback={<Spinner />}><AdminProductForm /></Suspense>} />
        <Route path="products/batch" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="products/:id" element={<Suspense fallback={<Spinner />}><AdminProductForm /></Suspense>} />
        <Route path="product-variations" element={<Suspense fallback={<Spinner />}><AdminProductVariations /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<Spinner />}><AdminCategories /></Suspense>} />
        <Route path="categories/new" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="categories/:id" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="attributes" element={<Suspense fallback={<Spinner />}><AdminAttributes /></Suspense>} />
        <Route path="vendors" element={<Suspense fallback={<Spinner />}><AdminVendors /></Suspense>} />
        <Route path="product-types" element={<Suspense fallback={<Spinner />}><AdminProductTypes /></Suspense>} />
        <Route path="product-workflow" element={<Suspense fallback={<Spinner />}><AdminProductWorkflow /></Suspense>} />
        <Route path="monitoring" element={<Suspense fallback={<Spinner />}><AdminMonitoring /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<Spinner />}><AdminOrders /></Suspense>} />
        <Route path="orders/invoices" element={<Suspense fallback={<Spinner />}><AdminInvoices /></Suspense>} />
        <Route path="orders/credit-slips" element={<Suspense fallback={<Spinner />}><AdminCreditSlips /></Suspense>} />
        <Route path="orders/delivery-slips" element={<Suspense fallback={<Spinner />}><AdminDeliverySlips /></Suspense>} />
        <Route path="orders/shopping-carts" element={<Suspense fallback={<Spinner />}><AdminShoppingCarts /></Suspense>} />
        <Route path="customers" element={<Suspense fallback={<Spinner />}><AdminCustomers /></Suspense>} />
        <Route path="inventory" element={<Suspense fallback={<Spinner />}><AdminInventory /></Suspense>} />
        <Route path="warehouses" element={<Suspense fallback={<Spinner />}><AdminWarehouses /></Suspense>} />
        <Route path="shipping" element={<Suspense fallback={<Spinner />}><AdminShipping /></Suspense>} />
        <Route path="b2b" element={<Suspense fallback={<Spinner />}><AdminB2B /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<Spinner />}><AdminUsers /></Suspense>} />
        <Route path="tax" element={<Suspense fallback={<Spinner />}><AdminTax /></Suspense>} />
        <Route path="payment" element={<Suspense fallback={<Spinner />}><AdminPayment /></Suspense>} />
        <Route path="coupons" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="stores" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="checkout-flow" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="pages" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
        <Route path="blog" element={<Suspense fallback={<Spinner />}><AdminPlaceholder /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
