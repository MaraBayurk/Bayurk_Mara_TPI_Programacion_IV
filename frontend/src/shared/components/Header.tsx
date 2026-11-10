import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  const handleLogout = async () => {
    setMenuOpen(false);

    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-xl text-white">
            ✦
          </span>
          <span className="text-xl font-bold tracking-tight text-purple-900">
            Food<span className="text-purple-500">Store</span>
          </span>
        </Link>

        {/* Navegación */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition hover:text-purple-700"
          >
            Catálogo
          </Link>

          {user?.role === "user" && (
            <Link
              to="/mis-pedidos"
              className="text-sm font-medium text-gray-600 transition hover:text-purple-700"
            >
              Mis pedidos
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/resumen"
              className="text-sm font-medium text-gray-600 transition hover:text-purple-700"
            >
              Administración
            </Link>
          )}

          <Link
            to="/carrito"
            className="relative flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-purple-700"
          >
            <span>Carrito</span>
            <span>🛒</span>

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Usuario y dropdown */}
        <div className="relative">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-purple-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-800">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>

                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-gray-800">
                    {user.full_name}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {user.role === "admin" ? "Administrador" : "Cliente"}
                  </span>
                </span>

                <span className="text-xs text-gray-500">⌄</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-purple-100 bg-white py-2 shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user.full_name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  {user.role === "user" && (
                    <Link
                      to="/mis-pedidos"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Mis pedidos
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      to="/admin/categorias"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Categorías
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      to="/admin/productos"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Productos
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/pedidos"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Pedidos
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin/resumen"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Panel de administración
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin/usuarios"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Usuarios
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span>↪</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-purple-700"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
