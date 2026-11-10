
export interface Category {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

export interface CategoryCreate {
  nombre: string
  descripcion: string
}

export type CategoryUpdate = Partial<CategoryCreate>
