
# Food Store - Frontend

Aplicación web de gestión y compra de productos desarrollada como Trabajo
Práctico Integrador de Programación IV.

El sistema permite a los usuarios consultar un catálogo de productos,
gestionar un carrito, realizar pedidos y consultar su historial de compras.
También dispone de un panel administrativo para gestionar productos,
categorías, pedidos y usuarios.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query 5
- TanStack Form
- TanStack Table
- Zustand
- Axios

## Requisitos previos

- Node.js
- npm
- Backend de Food Store en ejecución
- PostgreSQL configurado para el backend

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/MaraBayurk/Bayurk_Mara_TPI_Programacion_IV.git
```

Ingresar a la carpeta del frontend:

```bash
cd Bayurk_Mara_TPI_Programacion_IV/frontend
```

Instalar dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la carpeta `frontend`, tomando como referencia
`.env.example`.

Configurar la URL de la API:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

La URL debe coincidir con la dirección donde se encuentre ejecutándose
el backend.

## Ejecución

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Comprueba TypeScript y genera la compilación |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza la compilación |

## Funcionalidades

### Usuarios

- Registro de usuarios.
- Inicio y cierre de sesión.
- Validación de sesión mediante el backend.
- Acceso a funcionalidades según el rol.

### Catálogo y compras

- Listado de productos.
- Búsqueda por nombre.
- Filtro por categoría.
- Visualización de precios y disponibilidad.
- Carrito de compras.
- Modificación de cantidades.
- Confirmación de pedidos.

### Pedidos

- Consulta del historial de pedidos.
- Visualización del detalle.
- Cancelación de pedidos pendientes.
- Seguimiento del estado.

### Administración

- Resumen de pedidos.
- Alta, modificación y baja lógica de categorías.
- Alta, modificación y baja lógica de productos.
- Gestión de stock y disponibilidad.
- Consulta y actualización de pedidos.
- Activación y desactivación de usuarios.

## Arquitectura

El frontend utiliza una organización por funcionalidades:

```text
src/
├── app/
│   ├── layouts/
│   ├── providers/
│   └── router/
├── features/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   ├── orders/
│   ├── products/
│   └── users/
├── shared/
│   ├── components/
│   └── services/
├── store/
├── App.tsx
└── main.tsx
```

Cada módulo de `features` organiza sus páginas, componentes,
hooks, tipos y funciones de acceso a la API según sus necesidades.

## Gestión del estado

- **TanStack Query:** consultas, caché e invalidación de datos provenientes
  del backend.
- **Zustand:** estado global de autenticación y carrito.
- **TanStack Form:** formularios y validaciones.
- **TanStack Table:** tablas administrativas y paginación.

## Autenticación y seguridad

La autenticación se realiza mediante cookies HttpOnly gestionadas por
el backend.

Axios utiliza `withCredentials` para enviar las cookies en las peticiones.

El frontend no almacena el token de acceso en `localStorage` ni
en `sessionStorage`.

Las rutas administrativas están protegidas según el rol del usuario.

## Backend

El frontend consume la API REST de Food Store.

La URL base se configura mediante `VITE_API_URL`.

Para utilizar la aplicación es necesario que el backend esté iniciado
y que la base de datos se encuentre correctamente configurada.
