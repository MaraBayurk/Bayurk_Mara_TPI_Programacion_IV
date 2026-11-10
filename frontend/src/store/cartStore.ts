
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
  stock?: number
  disponible?: boolean
}

interface CartState {
  items: CartItem[]
  agregar: (item: Omit<CartItem, 'cantidad'>) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) => {
        if (producto.disponible === false) return

        const items = get().items
        const existente = items.find(
          (item) => item.producto_id === producto.producto_id,
        )

        const stockMaximo = producto.stock

        if (existente) {
          const stock = stockMaximo ?? existente.stock

          if (
            stock !== undefined &&
            existente.cantidad >= stock
          ) {
            return
          }

          set({
            items: items.map((item) =>
              item.producto_id === producto.producto_id
                ? {
                    ...item,
                    ...producto,
                    cantidad: item.cantidad + 1,
                  }
                : item,
            ),
          })

          return
        }

        if (stockMaximo !== undefined && stockMaximo < 1) return

        set({
          items: [
            ...items,
            {
              ...producto,
              cantidad: 1,
            },
          ],
        })
      },

      quitar: (productoId) =>
        set({
          items: get().items.filter(
            (item) => item.producto_id !== productoId,
          ),
        }),

      cambiarCantidad: (productoId, cantidad) => {
        if (cantidad < 1) return

        set({
          items: get().items.map((item) => {
            if (item.producto_id !== productoId) return item

            if (item.disponible === false) return item

            const cantidadMaxima = item.stock ?? cantidad

            return {
              ...item,
              cantidad: Math.min(cantidad, cantidadMaxima),
            }
          }),
        })
      },

      vaciar: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (acumulado, item) =>
            acumulado + item.precio_unitario * item.cantidad,
          0,
        ),
    }),
    {
      name: 'food-store-cart',
    },
  ),
)
