
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { useAuthStore } from '../../../store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError('')
        await login(value.username, value.password)

        const user = useAuthStore.getState().user
        navigate(user?.role === 'admin' ? '/admin/resumen' : '/', {
          replace: true,
        })
      } catch {
        setError('No se pudo iniciar sesión. Verificá tus credenciales.')
      }
    },
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F5E9FF] via-white to-[#E8D5FF] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-100/50">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#581C87]">
            Food Store
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Ingresá a tu cuenta
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim() ? undefined : 'Ingresá tu usuario',
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Usuario
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  autoComplete="username"
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Tu nombre de usuario"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : 'Ingresá tu contraseña',
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Tu contraseña"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form.Subscribe
            selector={(state) => state.isSubmitting}
          >
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-4 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-purple-700 hover:text-purple-900"
          >
            Registrate
          </Link>
        </p>
      </section>
    </main>
  )
}
