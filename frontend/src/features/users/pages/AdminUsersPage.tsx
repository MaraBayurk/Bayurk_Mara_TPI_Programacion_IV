
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import { useUsers } from '../hooks/useUsers'
import { useUserMutations } from '../hooks/useUserMutations'
import { useAuthStore } from '../../../store/authStore'
import type { AdminUser } from '../types/user.types'

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR')

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user)

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useUsers()

  const { activateMutation, deactivateMutation } = useUserMutations()

  const isPending =
    activateMutation.isPending || deactivateMutation.isPending

  const handleActivate = async (user: AdminUser) => {
    try {
      await activateMutation.mutateAsync(user.id)
    } catch {
      // El error se informa en la pantalla.
    }
  }

  const handleDeactivate = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `¿Estás seguro de desactivar al usuario "${user.username}"?`,
    )

    if (!confirmed) return

    try {
      await deactivateMutation.mutateAsync(user.id)
    } catch {
      // El error se informa en la pantalla.
    }
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800">
          {row.original.username}
        </span>
      ),
    },
    {
      accessorKey: 'full_name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
          {row.original.role === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      ),
    },
    {
      accessorKey: 'disabled',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = !row.original.disabled

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isActive ? 'Activo' : 'Desactivado'}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de registro',
      cell: ({ row }) => (
        <span className="text-gray-600">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const user = row.original
        const isCurrentUser = user.id === currentUser?.id

        if (isCurrentUser) {
          return (
            <span className="text-xs text-gray-400">
              Usuario actual
            </span>
          )
        }

        return (
          <div className="flex flex-wrap gap-2">
            {user.disabled ? (
              <button
                type="button"
                onClick={() => handleActivate(user)}
                disabled={isPending}
                className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
              >
                Activar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleDeactivate(user)}
                disabled={isPending}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                Desactivar
              </button>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-gray-500">Cargando usuarios...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-red-600">
          No se pudieron cargar los usuarios.
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
      <div className="mb-8">
        <p className="text-sm font-medium text-purple-600">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-bold text-purple-950">
          Usuarios
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Consultá los usuarios registrados y gestioná sus estados.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total de usuarios</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Usuarios activos</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {users.filter((user) => !user.disabled).length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Usuarios desactivados</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {users.filter((user) => user.disabled).length}
          </p>
        </div>
      </div>

      {(activateMutation.isError || deactivateMutation.isError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          No se pudo actualizar el estado del usuario. Intentá nuevamente.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
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
                    No hay usuarios registrados.
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
    </main>
  )
}
