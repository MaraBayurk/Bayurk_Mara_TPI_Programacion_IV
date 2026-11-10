
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { useCartStore } from '../../../store/cartStore'
import { useCreateOrder } from '../hooks/useCreateOrder'
import type { PaymentMethod } from '../types/order.types'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const vaciar = useCartStore((state) => state.vaciar)
  const total = useCartStore((state) => state.total)

  const createOrderMutation = useCreateOrder()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      direccion_entrega: '',
      forma_pago: 'EFECTIVO' as PaymentMethod,
      notas: '',
    },
    onSubmit: async ({ value }) => {
      if (items.length === 0) {
        setError('El carrito está vacío.')
        return
      }

      try {
        setError('')

        await createOrderMutation.mutateAsync({
          items: items.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
          })),
          direccion_entrega: value.direccion_entrega.trim(),
          forma_pago: value.forma_pago,
          notas: value.notas.trim(),
        })

        vaciar()
        navigate('/mis-pedidos', { replace: true })
      } catch {
        setError(
          'No se pudo crear el pedido. Verificá el stock y la disponibilidad de los productos.',
        )
      }
    },
  })

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7ff] px-6">
        <section className="max-w-md rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#581C87]">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-gray-500">
            Agregá productos antes de confirmar tu pedido.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
          >
            Ir al catálogo
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf7ff] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/carrito"
          className="text-sm font-medium text-purple-700 hover:text-purple-900"
        >
          ← Volver al carrito
        </Link>

        <h1 className="mb-8 mt-4 text-3xl font-extrabold text-[#581C87]">
          Confirmar pedido
        </h1>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px]">
          <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#581C87]">
              Datos de entrega y pago
            </h2>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
              className="space-y-6"
            >
              <form.Field
                name="direccion_entrega"
                validators={{
                  onChange: ({ value }) => {
                    const length = value.trim().length

                    if (length < 5) {
                      return 'La dirección debe tener al menos 5 caracteres'
                    }

                    if (length > 200) {
                      return 'La dirección no puede superar los 200 caracteres'
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
                      Dirección de entrega
                    </label>

                    <input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      maxLength={200}
                      placeholder="Ingresá tu dirección completa"
                      className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />

                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="forma_pago">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Forma de pago
                    </label>

                    <select
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value as PaymentMethod,
                        )
                      }
                      className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>
                )}
              </form.Field>

              <form.Field name="notas">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Notas (opcional)
                    </label>

                    <textarea
                      id={field.name}
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Indicaciones adicionales para la entrega"
                      className="w-full resize-y rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                )}
              </form.Field>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <button
                    type="submit"
                    disabled={isSubmitting || createOrderMutation.isPending}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-5 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting || createOrderMutation.isPending
                      ? 'Confirmando pedido...'
                      : 'Confirmar pedido'}
                  </button>
                )}
              </form.Subscribe>
            </form>
          </section>

          <aside className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#581C87]">
              Resumen del pedido
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.producto_id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.nombre}
                    </p>
                    <p className="text-gray-500">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>

                  <span className="font-semibold text-gray-700">
                    {formatPrice(item.precio_unitario * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-purple-100" />

            <div className="flex justify-between text-lg font-bold text-[#581C87]">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
