
import { useQuery } from '@tanstack/react-query'
import { getOrderSummary } from '../api/orders'

export const useOrderSummary = () => {
  return useQuery({
    queryKey: ['pedidos', 'resumen'],
    queryFn: getOrderSummary,
  })
}
