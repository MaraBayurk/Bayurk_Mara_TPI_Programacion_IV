import { Link } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const quitar = useCartStore((state) => state.quitar);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const total = useCartStore((state) => state.total);

  const subtotal = total();

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7ff] px-6">
        <section className="w-full max-w-lg rounded-2xl border border-purple-100 bg-white p-10 text-center shadow-sm">
          <div className="mb-5 text-5xl">🛒</div>

          <h1 className="text-2xl font-bold text-[#581C87]">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-gray-500">
            Todavía no agregaste productos. Explorá nuestro catálogo y encontrá
            algo que te guste.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Ver productos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7ff] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm font-medium text-purple-700 hover:text-purple-900"
          >
            ← Seguir comprando
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold text-[#581C87]">
            Mi carrito
          </h1>

          <p className="mt-2 text-gray-500">
            Revisá tus productos antes de continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.producto_id}
                className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.nombre}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Precio unitario: {formatPrice(item.precio_unitario)}
                    </p>

                    <p className="mt-2 font-semibold text-[#581C87]">
                      Subtotal:{" "}
                      {formatPrice(item.precio_unitario * item.cantidad)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-xl border border-purple-200">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(item.producto_id, item.cantidad + 1)
                        }
                        disabled={
                          item.stock !== undefined &&
                          item.cantidad >= item.stock
                        }
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                        className="px-3 py-2 text-lg font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        +
                      </button>

                      <span
                        className="min-w-10 text-center font-semibold text-gray-800"
                        aria-live="polite"
                      >
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(item.producto_id, item.cantidad + 1)
                        }
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                        className="px-3 py-2 text-lg font-semibold text-purple-700 transition hover:bg-purple-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => quitar(item.producto_id)}
                      className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#581C87]">
              Resumen de compra
            </h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Productos</span>
              <span>{items.reduce((sum, item) => sum + item.cantidad, 0)}</span>
            </div>

            <div className="mt-4 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="my-5 border-t border-purple-100" />

            <div className="flex justify-between text-lg font-bold text-[#581C87]">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-7 flex w-full justify-center rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-4 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              Continuar con la compra
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
