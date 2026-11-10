
import axios from 'axios'

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
    if (error.response?.status === 401) {
      // La sesión no está autenticada o expiró.
      // La gestión del estado se realizará desde la capa de autenticación.
    }

    return Promise.reject(error)
  },
)
