import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Field, Form, Formik, type FormikHelpers } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { LoginRequest } from '../api/auth'
import { StoreLayout } from '../components/layout/StoreLayout'
import { loginUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getUserFromToken, isAdminUser } from '../utils/authUser'

const initialValues: LoginRequest = {
  userName: '',
  password: '',
}

function validateLogin(values: LoginRequest) {
  const errors: { userName?: string; password?: string } = {}

  if (!values.userName.trim()) {
    errors.userName = 'Required'
  }

  if (!values.password.trim()) {
    errors.password = 'Required'
  }

  return errors
}

export function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authError = useAppSelector((state) => state.auth.error)
  const authStatus = useAppSelector((state) => state.auth.status)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(
    values: LoginRequest,
    helpers: FormikHelpers<LoginRequest>,
  ) {
    setFormError(null)

    try {
      const token = await dispatch(loginUser(values)).unwrap()
      const loggedUser = getUserFromToken(token)

      navigate(isAdminUser(loggedUser) ? '/admin' : '/account')
    } catch (error) {
      setFormError(typeof error === 'string' ? error : 'Login failed.')
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <section className="mx-auto max-w-[440px] rounded bg-white p-8 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
          <h1 className="mb-3 text-4xl font-medium">{t('auth.loginTitle')}</h1>
          <p className="mb-8 text-[#777]">{t('auth.loginSubtitle')}</p>
          <Formik
            initialValues={initialValues}
            validate={validateLogin}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => {
              const disabled = isSubmitting || authStatus === 'loading'
              const errorMessage = formError ?? authError

              return (
                <Form className="grid gap-4">
                  <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="userName" placeholder={t('auth.userName')} />
                  {touched.userName && errors.userName ? (
                    <small className="text-[#db4444]">{errors.userName}</small>
                  ) : null}
                  <label className="flex min-h-[54px] items-center rounded border border-[#cfcfcf] bg-white px-4 dark:border-neutral-700 dark:bg-neutral-950">
                    <Field
                      className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </label>
                  {touched.password && errors.password ? (
                    <small className="text-[#db4444]">{errors.password}</small>
                  ) : null}
                  <button className="justify-self-end border-0 bg-transparent text-[#db4444]" type="button">
                    {t('auth.forgot')}
                  </button>
                  <button className="inline-flex min-h-[52px] w-full items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white disabled:opacity-60" type="submit" disabled={disabled}>
                    {t('auth.login')}
                  </button>
                  {errorMessage ? <p className="text-[#db4444]">{errorMessage}</p> : null}
                </Form>
              )
            }}
          </Formik>
        </section>
      </main>
    </StoreLayout>
  )
}
