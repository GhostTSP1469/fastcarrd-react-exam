import { Mail, Phone } from 'lucide-react'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { StoreLayout } from '../components/layout/StoreLayout'

export function ContactPage() {
  const { t } = useTranslation()

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-[70px] text-[#777]">Home / {t('nav.contact')}</div>
        <div className="grid grid-cols-[340px_minmax(0,1fr)] gap-[30px] max-[860px]:grid-cols-1">
          <aside className="grid gap-8 rounded bg-white p-8 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
            <div>
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#db4444] text-white"><Phone size={26} /></span>
              <h2 className="mb-4 text-base font-semibold">{t('info.call')}</h2>
              <p className="mb-3 text-sm">We are available 24/7, 7 days a week.</p>
              <p className="text-sm">Phone: +8801611112222</p>
            </div>
            <hr className="border-[#d8d8d8] dark:border-neutral-700" />
            <div>
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#db4444] text-white"><Mail size={26} /></span>
              <h2 className="mb-4 text-base font-semibold">{t('info.write')}</h2>
              <p className="mb-3 text-sm">Fill out our form and we will contact you within 24 hours.</p>
              <p className="mb-3 text-sm">Emails: customer@exclusive.com</p>
              <p className="text-sm">Emails: support@exclusive.com</p>
            </div>
          </aside>

          <Formik initialValues={{ name: '', email: '', phone: '', message: '' }} onSubmit={() => undefined}>
            <Form className="grid gap-8 rounded bg-white p-8 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
              <div className="grid grid-cols-3 gap-4 max-[780px]:grid-cols-1">
                <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="name" placeholder="Name" />
                <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="email" placeholder="Email" />
                <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" name="phone" placeholder="Phone" />
              </div>
              <Field className="min-h-[200px] w-full resize-y rounded border border-[#cfcfcf] bg-white p-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" as="textarea" name="message" placeholder={t('info.message')} />
              <button type="submit" className="justify-self-end inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white max-[780px]:justify-self-stretch">
                {t('info.send')}
              </button>
            </Form>
          </Formik>
        </div>
      </main>
    </StoreLayout>
  )
}
