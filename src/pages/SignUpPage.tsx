import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout'
import { registerUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function SignUpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authError = useAppSelector((state) => state.auth.error)

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <section className="mx-auto max-w-[440px] rounded bg-white p-8 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
          <h1 className="mb-3 text-4xl font-medium">{t('auth.createTitle')}</h1>
          <p className="mb-8 text-[#777]">{t('auth.loginSubtitle')}</p>
          <Formik
            initialValues={{
              userName: '',
              phoneNumber: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={async (values) => {
              await dispatch(registerUser(values)).unwrap()
              navigate('/account')
            }}
          >
            <Form className="grid gap-4">
              <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="userName" placeholder={t('auth.name')} />
              <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="phoneNumber" placeholder={t('auth.phone')} />
              <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="email" placeholder="Email" />
              <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="password" type="password" placeholder={t('auth.password')} />
              <Field
                className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950"
                name="confirmPassword"
                type="password"
                placeholder={t('auth.confirmPassword')}
              />
              <button type="submit" className="inline-flex min-h-[52px] w-full items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white">
                {t('auth.createAccount')}
              </button>
              {authError ? <p className="text-[#db4444]">{authError}</p> : null}
            </Form>
          </Formik>
          <p className="mt-6 text-center text-[#777]">
            {t('auth.already')}{' '}
            <button className="border-b border-current bg-transparent text-[#111] dark:text-white" type="button" onClick={() => navigate('/login')}>
              {t('auth.login')}
            </button>
          </p>
        </section>
      </main>
    </StoreLayout>
  )
}
