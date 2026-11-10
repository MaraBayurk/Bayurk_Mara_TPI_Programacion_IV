
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../../categories/hooks/useCategories'
import { useCartStore } from '../../../store/cartStore'

const LIMIT = 8

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-purple-100 bg-white">
      <div className="h-48 bg-purple-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-purple-100" />
        <div className="h-3 w-full rounded bg-purple-50" />
        <div className="h-6 w-1/3 rounded bg-purple-100" />
        <div className="h-10 rounded-xl bg-purple-100" />
      </div>
    </div>
  )
}

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(0)

  const agregar = useCartStore((state) => state.agregar)
  const cartItems = useCartStore((state) => state.items)

  const filters = {
    skip: page * LIMIT,
    limit: LIMIT,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(categoryId ? { categoria_id: Number(categoryId) } : {}),
  }

  const {
    data: productsData,
    isLoading: loadingProducts,
    isError: productsError,
  } = useProducts(filters)

  const {
    data: categories,
    isLoading: loadingCategories,
  } = useCategories()

  const totalPages = Math.ceil(
    (productsData?.total ?? 0) / LIMIT,
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handleCategory = (value: string) => {
    setCategoryId(value)
    setPage(0)
  }

  return (
    <main className="min-h-screen bg-[#faf7ff]">
      <section className="bg-gradient-to-br from-[#F5E9FF] via-white to-[#E8D5FF] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-semibold text-purple-700">
            FOOD STORE
          </p>

          <h1 className="text-4xl font-extrabold text-[#581C87] md:text-5xl">
            Nuestro menú
          </h1>

          <p className="mt-3 max-w-xl text-gray-600">
            Descubrí nuestros productos y elegí tus favoritos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            className="min-w-0 flex-1 rounded-xl border border-purple-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <select
            value={categoryId}
            onChange={(event) => handleCategory(event.target.value)}
            disabled={loadingCategories}
            aria-label="Filtrar por categoría"
            className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="">Todas las categorías</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              handleSearch('')
              handleCategory('')
            }}
            className="rounded-xl border border-purple-200 px-5 py-3 font-medium text-purple-700 transition hover:bg-purple-50"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#581C87]">
            Productos
          </h2>

          <p className="text-sm text-gray-500">
            {productsData?.total ?? 0} resultados
          </p>
        </div>

        {productsError && (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
            No pudimos cargar los productos. Verificá tu conexión e intentá nuevamente.
          </div>
        )}

        {loadingProducts && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {!loadingProducts && !productsError && productsData?.items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-[#581C87]">
              No encontramos productos
            </h3>
            <p className="mt-2 text-gray-500">
              Probá cambiar la búsqueda o seleccionar otra categoría.
            </p>
          </div>
        )}

        {!loadingProducts && !productsError && productsData && productsData.items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productsData.items.map((product) => {
              const quantityInCart =
                cartItems.find(
                  (item) => item.producto_id === product.id,
                )?.cantidad ?? 0

              const canAdd =
                product.disponible && product.stock > quantityInCart

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
                >
                  <div className="h-48 overflow-hidden bg-purple-50">
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                      {product.categoria.nombre}
                    </p>

                    <h3 className="text-lg font-bold text-gray-800">
                      {product.nombre}
                    </h3>

                    <p className="mt-2 min-h-10 text-sm text-gray-500">
                      {product.descripcion}
                    </p>

                    <p className="mt-4 text-xl font-extrabold text-[#581C87]">
                      {formatPrice(product.precio_base)}
                    </p>

                    {!product.disponible || product.stock === 0 ? (
                      <p className="mt-3 text-sm font-medium text-red-600">
                        No disponible
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        Stock disponible: {product.stock - quantityInCart}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={!canAdd}
                      onClick={() =>
                        agregar({
                          producto_id: product.id,
                          nombre: product.nombre,
                          precio_unitario: product.precio_base,
                        })
                      }
                      className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                    >
                      {canAdd ? 'Agregar al carrito' : 'Sin disponibilidad'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loadingProducts && !productsError && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-xl border border-purple-200 px-5 py-2 font-medium text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="text-sm font-medium text-gray-600">
              Página {page + 1} de {totalPages}
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-purple-200 px-5 py-2 font-medium text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

