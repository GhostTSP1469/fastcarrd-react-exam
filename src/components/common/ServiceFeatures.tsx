import { Headphones, ShieldCheck, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ServiceFeatures() {
  const { t } = useTranslation()

  const items = [
    { icon: Truck, title: t('features.delivery'), text: t('features.deliveryText') },
    { icon: Headphones, title: t('features.support'), text: t('features.supportText') },
    { icon: ShieldCheck, title: t('features.guarantee'), text: t('features.guaranteeText') },
  ]

  return (
    <section className="grid grid-cols-3 gap-10 py-20 text-center max-[780px]:grid-cols-1">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <div key={item.title}>
            <span className="inline-flex h-[66px] w-[66px] items-center justify-center rounded-full border-[10px] border-[#c1c1c1] bg-black text-white">
              <Icon size={28} />
            </span>
            <h3 className="mb-2 mt-5 text-lg font-bold">{item.title}</h3>
            <p className="m-0 text-sm">{item.text}</p>
          </div>
        )
      })}
    </section>
  )
}
