
import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'

import { useCategories } from '../hooks/useCategories'
import { useCategoryMutations } from '../hooks/useCategoryMutations'
import type { Category } from '../types/category.types'

interface CategoryFormProps {
  category: Category | null
  onClose: () => void
  onSave: () => void
}

function CategoryForm({
  category,
  onClose,
  onSave,
}: CategoryFormProps) {
  const { createMutation, updateMutation } = useCategoryMutations()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      nombre: category?.nombre ?? '',
      descripcion: category?.descripcion ?? '',
    },
    onSubmit: async ({ value }) => {
      setError('')

      try {
        if (category) {
          await updateMutation.mutateAsync({
            id: category.id,
            data: value,
          })
        } else {
          await createMutation.mutateAsync(value)
        }

        onSave()
      } catch {
        setError('No se pudo guardar la categoría. Verificá los datos e intentá nuevamente.')
      }
    },
  })

  const isPending =
    createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-900">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>

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
          className="space-y-5"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => {
                const name = value.trim()

                if (name.length < 2) {
                  return 'El nombre debe tener al menos 2 caracteres.'
                }

                if (name.length > 100) {
                  return 'El nombre no puede superar los 100 caracteres.'
                }

                return undefined
              },
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
                  maxLength={100}
                  placeholder="Ej. Hamburguesas"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                  rows={4}
                  placeholder="Describí la categoría..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            )}
          </form.Field>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:opacity-50"
            >
              {isPending
                ? 'Guardando...'
                : category
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } =
    useCategories()

  const { deleteMutation } = useCategoryMutations()

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `¿Estás seguro de dar de baja la categoría "${category.nombre}"?`,
    )

    if (!confirmed) return

    setDeleteError('')

    try {
      await deleteMutation.mutateAsync(category.id)
    } catch {
      setDeleteError('No se pudo dar de baja la categoría.')
    }
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800">
          {row.original.nombre}
        </span>
      ),
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.original.descripcion || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {row.original.activo ? 'Activa' : 'Inactiva'}
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
              setSelectedCategory(row.original)
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
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-gray-500">Cargando categorías...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-red-600">
          No se pudieron cargar las categorías.
        </p>
        <button
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
            Categorías
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestioná las categorías del catálogo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null)
            setShowForm(true)
          }}
          className="rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-purple-800 hover:to-purple-700"
        >
          + Nueva categoría
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Categorías activas</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {categories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Registros disponibles</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {categories.length}
          </p>
        </div>
      </div>

      {deleteError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {deleteError}
        </p>
      )}

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
                    No hay categorías registradas.
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
        <CategoryForm
          key={selectedCategory?.id ?? 'new'}
          category={selectedCategory}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            setSelectedCategory(null)
          }}
        />
      )}
    </main>
  )
}
