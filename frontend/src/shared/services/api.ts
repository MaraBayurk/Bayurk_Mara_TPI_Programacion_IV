
import axios from 'axios'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export const setUnauthorizedHandler = (
  handler: UnauthorizedHandler,
) => {
  unauthorizedHandler = handler
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const detail = error.response?.data?.detail

    const isAuthEndpoint =
      url.includes('/auth/token') ||
      url.includes('/auth/me')

    const isUnauthorized =
      status === 401 && !isAuthEndpoint

    const isDisabledAccount =
      status === 400 &&
      detail === 'Cuenta de usuario desactivada'

    if (isUnauthorized || isDisabledAccount) {
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)
