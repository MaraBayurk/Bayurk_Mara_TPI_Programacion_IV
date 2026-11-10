
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { CatalogPage } from '../../features/products/pages/CatalogPage'
import { CartPage } from '../../features/cart/pages/CartPage'
import { CheckoutPage } from '../../features/orders/pages/CheckoutPage'
import MyOrdersPage from '../../features/orders/pages/MyOrdersPage'


function AdminSummaryPage() {
  return <h1>Resumen de administración</h1>
}

function AdminCategoriesPage() {
  return <h1>Administrar categorías</h1>
}

function AdminProductsPage() {
  return <h1>Administrar productos</h1>
}

function AdminOrdersPage() {
  return <h1>Administrar pedidos</h1>
}

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
    path: '/',
    element: <CatalogPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
        element: <AdminSummaryPage />,
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
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
