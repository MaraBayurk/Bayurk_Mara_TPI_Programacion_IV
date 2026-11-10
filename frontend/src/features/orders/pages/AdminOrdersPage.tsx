
import { useState } from 'react'
import { useAdminOrders } from '../hooks/useAdminOrders'
import { useAdminOrderMutations } from '../hooks/useAdminOrderMutations'
import type { Order, OrderStatus } from '../types/order.types'

const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

const statusStyles: Record<OrderStatus, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  EN_PREPARACION: 'bg-blue-100 text-blue-800',
  ENTREGADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

const formatPrice = (price: number) =>
  price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  })

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('')

  const { data, isLoading, isError, error } = useAdminOrders(
    selectedStatus || undefined,
  )

  const { updateStatusMutation } = useAdminOrderMutations()

  const handleStatusChange = async (
    order: Order,
    newStatus: OrderStatus,
  ) => {
    if (newStatus === 'CANCELADO') {
      const confirmed = window.confirm(
        `¿Estás seguro de que querés cancelar el pedido #${order.id}?`,
      )

      if (!confirmed) return
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        data: { estado: newStatus },
      })
    } catch {
      // El error se muestra en la pantalla.
    }
  }

  const renderActions = (order: Order) => {
    if (order.estado === 'ENTREGADO' || order.estado === 'CANCELADO') {
      return <span className="text-sm text-gray-400">Sin acciones</span>
    }

    return (
      <div className="flex flex-wrap gap-2">
        {order.estado === 'PENDIENTE' && (
          <button
            type="button"
            onClick={() => handleStatusChange(order, 'EN_PREPARACION')}
            disabled={updateStatusMutation.isPending}
            className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Preparar
          </button>
        )}

        {order.estado === 'EN_PREPARACION' && (
          <button
            type="button"
            onClick={() => handleStatusChange(order, 'ENTREGADO')}
            disabled={updateStatusMutation.isPending}
            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Entregar
          </button>
        )}

        <button
          type="button"
          onClick={() => handleStatusChange(order, 'CANCELADO')}
          disabled={updateStatusMutation.isPending}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Administración de pedidos
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultá los pedidos y gestioná sus estados.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor="order-status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Filtrar por estado
          </label>

          <select
            id="order-status"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as OrderStatus | '')
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:w-64"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PREPARACION">En preparación</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {data?.total ?? 0} pedidos encontrados
        </p>
      </div>

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-500">
          Cargando pedidos...
        </p>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudieron cargar los pedidos.
          {error instanceof Error && ` ${error.message}`}
        </div>
      )}

      {updateStatusMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudo actualizar el estado del pedido. Verificá que la
          transición sea válida e intentá nuevamente.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Pedido</th>
                <th className="px-5 py-4 font-semibold">Cliente</th>
                <th className="px-5 py-4 font-semibold">Fecha</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Estado</th>
                <th className="px-5 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data?.items.map((order) => (
                <tr key={order.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    #{order.id}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    Usuario #{order.usuario_id}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    {formatPrice(order.total)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.estado]}`}
                    >
                      {statusLabels[order.estado]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {renderActions(order)}
                  </td>
                </tr>
              ))}

              {data?.items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No hay pedidos para el estado seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
