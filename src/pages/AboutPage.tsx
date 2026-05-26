import { DollarSign, Gift, ShoppingBag, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ServiceFeatures } from '../components/common/ServiceFeatures'
import { StoreLayout } from '../components/layout/StoreLayout'

const aboutStats = [
  {
    Icon: Store,
    value: '10.5k',
    label: 'Sallers active our site',
  },
  {
    Icon: DollarSign,
    value: '33k',
    label: 'Mopnthly Produuduct Sale',
  },
  {
    Icon: Gift,
    value: '45.5k',
    label: 'Customer active in our site',
  },
  {
    Icon: ShoppingBag,
    value: '25k',
    label: 'Anual gross sale in our site',
  },
]

const teamMembers = [
  {
    name: 'Tom Cruise',
    role: 'Founder & Chairman',
    image: '/about-assets/team-tom-crop.jpg',
  },
  {
    name: 'Emma Watson',
    role: 'Managing Director',
    image: '/about-assets/team-emma-crop.jpg',
  },
  {
    name: 'Will Smith',
    role: 'Product Designer',
    image: '/about-assets/team-will-crop.jpg',
  },
]

function SocialLinks() {
  return (
    <div className="flex gap-4">
      <svg className="h-[22px] w-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter">
        <path d="M21.5 6.1c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.7 1A4.1 4.1 0 0 0 11 8.2c0 .3 0 .6.1.9A11.7 11.7 0 0 1 2.6 4.8a4 4 0 0 0-.6 2.1c0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.4.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.7 2.1 2.9 3.9 2.9A8.3 8.3 0 0 1 2 18.7H1a11.7 11.7 0 0 0 6.3 1.8c7.6 0 11.8-6.3 11.8-11.8v-.5c.9-.6 1.6-1.3 2.4-2.1z" />
      </svg>
      <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" aria-label="Instagram">
        <rect width="17" height="17" x="3.5" y="3.5" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
      </svg>
      <svg className="h-[22px] w-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-label="LinkedIn">
        <path d="M5.4 8.7H2.2V22h3.2V8.7zM3.8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM22 14.6c0-3.6-1.9-5.2-4.4-5.2-2 0-2.9 1.1-3.4 1.9V8.7H11V22h3.2v-6.6c0-1.8.3-3.5 2.5-3.5s2.2 2 2.2 3.6V22H22v-7.4z" />
      </svg>
    </div>
  )
}

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-[70px] text-[#777]">Home / {t('nav.about')}</div>

        <section className="grid grid-cols-[1fr_1fr] items-center gap-[70px] max-[860px]:grid-cols-1">
          <div>
            <h1 className="mb-10 text-[54px] font-semibold leading-tight">Our Story</h1>
            <p className="mb-6 leading-relaxed">
              Launced in 2015, Exclusive is South Asia's premier online shopping
              makterplace with an active presense in Bangladesh. Supported by
              wide range of tailored marketing, data and service solutions,
              Exclusive has 10,500 sallers and 300 brands and serves 3
              millions customers across the region.
            </p>
            <p className="leading-relaxed">
              Exclusive has more than 1 Million products to offer, growing at a
              very fast. Exclusive offers a diverse assotment in categories
              ranging from consumer.
            </p>
          </div>
          <img
            className="h-[520px] w-full rounded object-cover max-[860px]:h-[360px]"
            src="/about-assets/about-story-crop.jpg"
            alt="Shopping customers"
          />
        </section>

        <section className="my-32 grid grid-cols-4 gap-[30px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {aboutStats.map((stat) => (
            <article
              key={stat.value}
              className="group grid min-h-[230px] place-items-center rounded border border-[#d8d8d8] bg-white p-7 text-center transition duration-200 hover:border-[#db4444] hover:bg-[#db4444] hover:text-white hover:shadow-[0_12px_32px_rgb(219_68_68_/_28%)] dark:border-neutral-700 dark:bg-neutral-950"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border-[10px] border-[#c1c1c1] bg-black text-white transition duration-200 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
                <stat.Icon size={28} />
              </span>
              <h3 className="text-[32px] font-bold">{stat.value}</h3>
              <p>{stat.label}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-3 gap-[30px] max-[900px]:grid-cols-1">
          {teamMembers.map((member) => (
            <article key={member.name}>
              <div className="grid h-[430px] place-items-end overflow-hidden rounded bg-[#f5f5f5] dark:bg-neutral-900">
                <img className="h-full w-full object-cover object-top" src={member.image} alt={member.name} />
              </div>
              <h3 className="mb-2 mt-8 text-[32px] font-medium">{member.name}</h3>
              <p className="mb-4">{member.role}</p>
              <SocialLinks />
            </article>
          ))}
        </section>

        <div className="mt-10 flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((dot) => (
            <button
              key={dot}
              type="button"
              className={`h-3 w-3 rounded-full ${dot === 3 ? 'border-2 border-[#999] bg-[#db4444]' : 'bg-[#b5b5b5]'}`}
              aria-label={`Team slide ${dot}`}
            />
          ))}
        </div>

        <ServiceFeatures />
      </main>
    </StoreLayout>
  )
}
