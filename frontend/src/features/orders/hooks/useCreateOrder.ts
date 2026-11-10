import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../api/orders'
import type { OrderCreate } from '../types/order.types'

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: OrderCreate) => createOrder(data),
  })
}