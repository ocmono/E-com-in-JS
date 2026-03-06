# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






<!-- structure -->
my-app/src/
├── api/                      # API layer (one file per domain)
│   ├── client.js             # Base fetch wrapper
│   ├── productApi.js         # Products + mock fallback
│   ├── authApi.js
│   ├── cartApi.js
│   ├── orderApi.js
│   └── mockData.js           # Mock products when no backend
├── stores/
│   ├── authStore.js          # User, roles, login, logout, useDemoAdmin
│   └── cartStore.js          # Cart items, persisted
├── components/
│   ├── Layout.jsx
│   ├── AdminBar.jsx          # Only for staff (admin/manager/shop_owner)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── CartFlyout.jsx
│   └── Spinner.jsx
├── pages/
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── Product.jsx
│   ├── Cart.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Blog.jsx
│   ├── Account.jsx
│   ├── Orders.jsx
│   ├── Checkout.jsx
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       ├── AdminOrders.jsx
│       └── AdminUsers.jsx
└── App.jsx