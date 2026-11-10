
import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'

import { useProducts } from '../hooks/useProducts'
import { useProductMutations } from '../hooks/useProductMutations'
import { useCategories } from '../../categories/hooks/useCategories'

import type {
  Product,
  ProductCreate,
  ProductUpdate,
} from '../types/product.types'

import type { Category } from '../../categories/types/category.types'

interface ProductFormProps {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

function ProductForm({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormProps) {
  const {
    createMutation,
    updateMutation,
    stockMutation,
  } = useProductMutations()

  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      nombre: product?.nombre ?? '',
      descripcion: product?.descripcion ?? '',
      precio_base: product?.precio_base ?? 0,
      imagen_url: product?.imagen_url ?? '',
      stock: product?.stock ?? 0,
      disponible: product?.disponible ?? true,
      categoria_id: product?.categoria_id ?? categories[0]?.id ?? 0,
    },
    onSubmit: async ({ value }) => {
      setError('')

      try {
        if (product) {
          const data: ProductUpdate = {
            nombre: value.nombre,
            descripcion: value.descripcion,
            precio_base: value.precio_base,
            imagen_url: value.imagen_url,
            categoria_id: value.categoria_id,
          }

          await updateMutation.mutateAsync({
            id: product.id,
            data,
          })

          if (
            value.stock !== product.stock ||
            value.disponible !== product.disponible
          ) {
            await stockMutation.mutateAsync({
              id: product.id,
              data: {
                stock: value.stock,
                disponible: value.disponible,
              },
            })
          }
        } else {
          const data: ProductCreate = value
          await createMutation.mutateAsync(data)
        }

        onSave()
      } catch {
        setError(
          'No se pudo guardar el producto. Verificá los datos e intentá nuevamente.',
        )
      }
    },
  })

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    stockMutation.isPending

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-purple-900">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Completá los datos del producto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0
                  ? 'El nombre es obligatorio.'
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) =>
                  value < 0
                    ? 'El precio no puede ser negativo.'
                    : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="categoria_id"
              validators={{
                onChange: ({ value }) =>
                  value <= 0
                    ? 'Seleccioná una categoría.'
                    : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Categoría
                  </label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value={0} disabled>
                      Seleccioná una categoría
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="imagen_url">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  URL de imagen
                </label>
                <input
                  id={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  value < 0
                    ? 'El stock no puede ser negativo.'
                    : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    min="0"
                    step="1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="disponible">
              {(field) => (
                <div className="flex items-center gap-3 pt-7">
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.checked)
                    }
                    className="h-4 w-4 accent-purple-700"
                  />
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-gray-700"
                  >
                    Producto disponible
                  </label>
                </div>
              )}
            </form.Field>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending || categories.length === 0}
              className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:opacity-50"
            >
              {isPending
                ? 'Guardando...'
                : product
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts({ skip: 0, limit: 100 })

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useCategories()

  const { deleteMutation } = useProductMutations()

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const products = data?.items ?? []

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Estás seguro de dar de baja el producto "${product.nombre}"?`,
    )

    if (!confirmed) return

    setDeleteError('')

    try {
      await deleteMutation.mutateAsync(product.id)
    } catch {
      setDeleteError('No se pudo dar de baja el producto.')
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'nombre',
      header: 'Producto',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-gray-800">
            {row.original.nombre}
          </p>
          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
            {row.original.descripcion || 'Sin descripción'}
          </p>
        </div>
      ),
    },
    {
      id: 'categoria',
      header: 'Categoría',
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.original.categoria?.nombre ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'precio_base',
      header: 'Precio',
      cell: ({ row }) =>
        new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
        }).format(row.original.precio_base),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <span className="font-medium text-gray-700">
          {row.original.stock}
        </span>
      ),
    },
    {
      accessorKey: 'disponible',
      header: 'Disponibilidad',
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.original.disponible
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.original.disponible ? 'Disponible' : 'No disponible'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(row.original)
              setShowForm(true)
            }}
            className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDelete(row.original)}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            Dar de baja
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  if (isLoading || isLoadingCategories) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-gray-500">Cargando productos...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-red-600">
          No se pudieron cargar los productos.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-purple-700 px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-purple-600">
            Administración
          </p>
          <h1 className="mt-1 text-3xl font-bold text-purple-950">
            Productos
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestioná el catálogo, los precios y el stock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProduct(null)
            setShowForm(true)
          }}
          disabled={categories.length === 0}
          className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800 disabled:opacity-50"
        >
          + Nuevo producto
        </button>
      </div>

      {categories.length === 0 && (
        <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Para crear productos primero necesitás tener al menos una categoría activa.
        </p>
      )}

      {deleteError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {deleteError}
        </p>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Productos listados</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {data?.total ?? products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Disponibles</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {products.filter((product) => product.disponible).length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Sin stock</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {products.filter((product) => product.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-50 text-xs uppercase tracking-wide text-purple-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-4 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-purple-50/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {Math.max(table.getPageCount(), 1)}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <ProductForm
          key={selectedProduct?.id ?? 'new'}
          product={selectedProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </main>
  )
}
