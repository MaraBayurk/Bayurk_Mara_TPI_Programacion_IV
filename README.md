# Food Store – Trabajo Práctico Integrador

Alumno: Bayurk Mara Valentina
Trabajo Práctico Integrador: **Programación IV – UTN**.

Repositorio: https://github.com/MaraBayurk/Bayurk_Mara_TPI_Programacion_IV
Video: 

## Sistema web de gestión y comercialización de productos

La aplicación permite consultar un catálogo de productos, gestionar un carrito de compras, realizar pedidos y consultar su historial. Además, cuenta con un panel administrativo para gestionar productos, categorías, stock, pedidos y usuarios.

## Tecnologías utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand
- Axios

### Backend
- Python
- FastAPI
- SQLModel
- PostgreSQL
- SQLAlchemy
- JWT para autenticación

## Arquitectura del proyecto

El proyecto se encuentra organizado en dos módulos principales:

```text
Bayurk_Mara_TPI_Programacion_IV/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── modules/
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   ├── shared/
│   │   └── store/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

El backend implementa una API REST organizada por módulos funcionales. El frontend utiliza una arquitectura basada en funcionalidades para separar páginas, componentes, servicios y lógica de cada módulo.

## Funcionalidades principales

### Usuarios
- Registro e inicio de sesión.
- Autenticación mediante cookies HttpOnly.
- Control de acceso según el rol del usuario.

### Catálogo y compras
- Consulta y búsqueda de productos.
- Filtrado por categoría.
- Visualización de disponibilidad y stock.
- Gestión del carrito de compras.
- Creación de pedidos.

### Pedidos
- Consulta del historial de compras.
- Visualización del detalle.
- Seguimiento del estado del pedido.
- Cancelación de pedidos según las reglas de negocio.

### Administración
- Gestión de categorías.
- Gestión de productos.
- Administración de stock y disponibilidad.
- Consulta y actualización de pedidos.
- Activación y desactivación de usuarios.
- Visualización de información resumida de pedidos.

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Git.
- Node.js.
- pnpm.
- Python.
- PostgreSQL.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/MaraBayurk/Bayurk_Mara_TPI_Programacion_IV.git

cd Bayurk_Mara_TPI_Programacion_IV
```

### 2. Configurar la base de datos

Crear una base de datos PostgreSQL llamada `foodstore_db`.

Por ejemplo, desde `psql`:

```sql
CREATE DATABASE foodstore_db;
```

### 3. Configurar el backend

Ingresar a la carpeta:

```bash
cd backend
```

Crear y activar un entorno virtual:

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

Crear el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

En Windows, también se puede copiar manualmente el archivo.

Configurar las variables de entorno:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/foodstore_db

SECRET_KEY=change-this-secret-key-with-at-least-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173

COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

Reemplazar los valores de conexión y la clave secreta según el entorno local.

### 4. Inicializar datos de prueba

Desde la carpeta `backend`, con el entorno virtual activado, ejecutar:

```bash
python -m app.db.seed
```

El seed crea los datos iniciales del sistema, incluyendo un usuario administrador, categorías y productos de ejemplo.

**Credenciales iniciales del administrador:**

- Usuario: `admin`
- Contraseña: `Admin1234!`

Estas credenciales son para el entorno de desarrollo. Deben cambiarse antes de utilizar el sistema en un entorno real.

### 5. Iniciar el backend

Desde la carpeta `backend`:

```bash
uvicorn app.main:app --reload
```

El backend estará disponible en:

```text
http://localhost:8000
```

La documentación interactiva de la API se encuentra en:

```text
http://localhost:8000/docs
```

### 6. Configurar el frontend

Abrir una nueva terminal e ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
pnpm install
```

Crear el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Configurar la URL de la API:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 7. Iniciar el frontend

Desde la carpeta `frontend`:

```bash
pnpm dev
```

La aplicación estará disponible en la dirección local que indique Vite, normalmente:

```text
http://localhost:5173
```

## Scripts del frontend

Ejecutar estos comandos desde la carpeta `frontend`:

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo. |
| `pnpm build` | Verifica TypeScript y genera la compilación de producción. |
| `pnpm lint` | Ejecuta ESLint. |
| `pnpm preview` | Previsualiza la compilación generada. |

## Seguridad y autenticación

La autenticación utiliza tokens gestionados mediante cookies HttpOnly.

El frontend realiza las peticiones HTTP utilizando Axios con envío de credenciales (`withCredentials`).

El token de acceso no se almacena en `localStorage` ni en `sessionStorage`.

El acceso a las funcionalidades administrativas se controla mediante rutas protegidas y validación de roles.

## Documentación adicional

- [Documentación del frontend](./frontend/README.md)
- [Documentación interactiva del backend](http://localhost:8000/docs)

---

**Proyecto académico – Programación IV – UTN.**