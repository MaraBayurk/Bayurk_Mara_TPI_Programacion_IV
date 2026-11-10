
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA'

export type OrderStatus =
  | 'PENDIENTE'
  | 'EN_PREPARACION'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface OrderItemCreate {
  producto_id: number
  cantidad: number
}

export interface OrderCreate {
  items: OrderItemCreate[]
  forma_pago: PaymentMethod
  direccion_entrega: string
  notas: string
}

export interface OrderDetail {
  producto_id: number
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

export interface Order {
  id: number
  usuario_id: number
  estado: OrderStatus
  forma_pago: PaymentMethod
  direccion_entrega: string
  notas: string | null
  total: number
  created_at: string
  updated_at: string
  items: OrderDetail[]
}

export interface OrdersPaginated {
  total: number
  items: Order[]
}

export interface OrderSummary {
  pendientes: number
  en_preparacion: number
  entregados: number
  cancelados: number
  pedidos_hoy: number
  ingresos_entregados: number
}
