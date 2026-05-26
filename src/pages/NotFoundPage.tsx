import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout'

export function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <StoreLayout>
      <main className="mx-auto grid min-h-[60vh] max-w-[1170px] place-items-center px-6 py-20 text-center">
        <div>
        <h1 className="mb-4 text-[58px] font-bold">{t('info.notFound')}</h1>
        <p className="mb-8 text-[#777]">{t('info.notFoundText')}</p>
        <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" onClick={() => navigate('/')}>
          {t('info.backHome')}
        </button>
        </div>
      </main>
    </StoreLayout>
  )
}
