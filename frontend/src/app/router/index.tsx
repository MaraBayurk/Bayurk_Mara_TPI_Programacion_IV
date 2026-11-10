
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'

import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { CatalogPage } from '../../features/products/pages/CatalogPage'
import { CartPage } from '../../features/cart/pages/CartPage'
import { CheckoutPage } from '../../features/orders/pages/CheckoutPage'
import MyOrdersPage from '../../features/orders/pages/MyOrdersPage'
import OrderSummaryPage from '../../features/orders/pages/OrderSummaryPage'
import AdminCategoriesPage from '../../features/categories/pages/AdminCategoriesPage'
import AdminProductsPage from '../../features/products/pages/AdminProductsPage'
import AdminOrdersPage from '../../features/orders/pages/AdminOrdersPage'

function AdminUsersPage() {
  return <h1>Administrar usuarios</h1>
}

function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#581C87]">
          Acceso denegado
        </h1>
        <p className="mt-2 text-gray-600">
          No tenés permisos para acceder a esta sección.
        </p>
      </div>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <CatalogPage />,
      },
      {
        path: '/carrito',
        element: <CartPage />,
      },
      {
        element: <ProtectedRoute allowedRoles={['user', 'admin']} />,
        children: [
          {
            path: '/checkout',
            element: <CheckoutPage />,
          },
          {
            path: '/mis-pedidos',
            element: <MyOrdersPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: '/admin/resumen',
            element: <OrderSummaryPage />,
          },
          {
            path: '/admin/categorias',
            element: <AdminCategoriesPage />,
          },
          {
            path: '/admin/productos',
            element: <AdminProductsPage />,
          },
          {
            path: '/admin/pedidos',
            element: <AdminOrdersPage />,
          },
          {
            path: '/admin/usuarios',
            element: <AdminUsersPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
