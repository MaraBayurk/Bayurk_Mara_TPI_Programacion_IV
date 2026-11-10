
import { api } from '../../../shared/services/api'
import type {
  Order,
  OrderCreate,
  OrdersPaginated,
  OrderSummary
} from '../types/order.types'


export const createOrder = async (data: OrderCreate): Promise<Order> => {
  const response = await api.post<Order>('/pedidos', data)
  return response.data
}

export const getOrders = async (
  skip = 0,
  limit = 10,
): Promise<OrdersPaginated> => {
  const response = await api.get<OrdersPaginated>('/pedidos', {
    params: { skip, limit },
  })

  return response.data
}

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/pedidos/${id}`)
  return response.data
}

export const cancelOrder = async (id: number): Promise<Order> => {
  const response = await api.patch<Order>(`/pedidos/${id}/cancelar`)
  return response.data
}

export const getOrderSummary = async (): Promise<OrderSummary> => {
  const response = await api.get<OrderSummary>('/pedidos/resumen')
  return response.data
}