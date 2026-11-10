import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useOrder } from "../hooks/useOrder";
import { useCancelOrder } from "../hooks/useCancelOrder";
import type { Order, OrderStatus } from "../types/order.types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <h3 className="mb-3 font-semibold text-gray-800">Productos del pedido</h3>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={item.producto_id}
            className="flex justify-between gap-4 text-sm"
          >
            <div>
              <p className="font-medium text-gray-800">
                {item.nombre_producto}
              </p>
              <p className="text-gray-500">
                {item.cantidad} × {formatPrice(item.precio_unitario)}
              </p>
            </div>

            <span className="font-medium text-gray-800">
              {formatPrice(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
        <p>
          <span className="text-gray-500">Dirección:</span>{" "}
          {order.direccion_entrega}
        </p>
        <p>
          <span className="text-gray-500">Forma de pago:</span>{" "}
          {order.forma_pago}
        </p>
        {order.notas && (
          <p>
            <span className="text-gray-500">Notas:</span> {order.notas}
          </p>
        )}
        <p className="flex justify-between pt-2 font-bold text-gray-900">
          Total <span>{formatPrice(order.total)}</span>
        </p>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const ordersQuery = useOrders();
  const detailQuery = useOrder(selectedOrderId ?? 0);
  const cancelMutation = useCancelOrder();

  const handleCancel = (orderId: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que querés cancelar este pedido?",
    );

    if (confirmed) {
      cancelMutation.mutate(orderId);
    }
  };

  if (ordersQuery.isLoading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-gray-500">Cargando tus pedidos...</p>
      </main>
    );
  }

  if (ordersQuery.isError) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">
          No se pudieron cargar tus pedidos. Intentá nuevamente.
        </p>
        <button
          onClick={() => ordersQuery.refetch()}
          className="mt-3 rounded-lg bg-purple-700 px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </main>
    );
  }

  const orders = ordersQuery.data?.items ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Mis pedidos</h1>
      <p className="mb-6 text-gray-500">
        Consultá el estado y los detalles de tus compras.
      </p>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Todavía no tenés pedidos
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Cuando realices una compra, aparecerá acá.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  {statusLabels[order.estado]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {order.items.length} producto(s)
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setSelectedOrderId(
                        selectedOrderId === order.id ? null : order.id,
                      )
                    }
                    className="rounded-lg border border-purple-700 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
                  >
                    {selectedOrderId === order.id
                      ? "Ocultar detalle"
                      : "Ver detalle"}
                  </button>

                  {order.estado === "PENDIENTE" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelMutation.isPending}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Cancelar pedido
                    </button>
                  )}
                </div>
              </div>

              {selectedOrderId === order.id && (
                <div>
                  {detailQuery.isLoading ? (
                    <p className="mt-4 text-sm text-gray-500">
                      Cargando detalle...
                    </p>
                  ) : detailQuery.isError ? (
                    <p className="mt-4 text-sm text-red-600">
                      No se pudo cargar el detalle del pedido.
                    </p>
                  ) : detailQuery.data ? (
                    <OrderDetails order={detailQuery.data} />
                  ) : null}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {cancelMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          No se pudo cancelar el pedido. Puede que ya no esté pendiente.
        </p>
      )}
    </main>
  );
}
