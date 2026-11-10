
export interface Category {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

export interface Product {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  stock: number
  disponible: boolean
  categoria_id: number
  activo: boolean
  categoria: Category
}

export interface ProductsPaginated {
  total: number
  items: Product[]
}

export interface ProductFilters {
  skip: number
  limit: number
  search?: string
  categoria_id?: number
}
