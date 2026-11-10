
import { useOrderSummary } from '../hooks/useOrderSummary'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)

const summaryCards = [
  {
    key: 'pendientes',
    label: 'Pedidos pendientes',
    color: 'border-amber-400',
    icon: '🕒',
  },
  {
    key: 'en_preparacion',
    label: 'En preparación',
    color: 'border-blue-400',
    icon: '🍳',
  },
  {
    key: 'entregados',
    label: 'Pedidos entregados',
    color: 'border-green-400',
    icon: '✓',
  },
  {
    key: 'cancelados',
    label: 'Pedidos cancelados',
    color: 'border-red-400',
    icon: '✕',
  },
  {
    key: 'pedidos_hoy',
    label: 'Pedidos de hoy',
    color: 'border-purple-400',
    icon: '📦',
  },
] as const

export default function OrderSummaryPage() {
  const { data, isLoading, isError, refetch } = useOrderSummary()

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-gray-500">Cargando resumen...</p>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-red-600">No se pudo cargar el resumen.</p>
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Resumen de pedidos
      </h1>
      <p className="mb-8 mt-2 text-gray-500">
        Indicadores generales de actividad.
      </p>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.key}
            className={`rounded-2xl border border-gray-200 border-l-4 ${card.color} bg-white p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {card.label}
              </p>
              <span className="text-2xl">{card.icon}</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {data[card.key]}
            </p>
          </article>
        ))}

        <article className="rounded-2xl border border-gray-200 border-l-4 border-emerald-500 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Ingresos entregados
          </p>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {formatCurrency(data.ingresos_entregados)}
          </p>
        </article>
      </section>
    </main>
  )
}
