import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function getTimeLeft(targetDate: number) {
  const distance = Math.max(targetDate - Date.now(), 0)

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  }
}

export function CountdownTimer({
  variant = 'default',
}: {
  variant?: 'default' | 'promo'
}) {
  const { t } = useTranslation()
  const [targetDate] = useState(
    () => Date.now() + 3 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000,
  )
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [targetDate])

  if (variant === 'promo') {
    return (
      <div className="mb-8 flex gap-[18px]" aria-label="Promotion countdown">
        {Object.entries(timeLeft).map(([key, value]) => (
          <b
            key={key}
            className="inline-flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white text-black"
            aria-label={t(`time.${key}`)}
          >
            {String(value).padStart(2, '0')}
          </b>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-[18px] max-[780px]:items-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key}>
          <span className="block text-[11px] font-semibold">{t(`time.${key}`)}</span>
          <strong className="block text-3xl leading-none">{String(value).padStart(2, '0')}</strong>
        </div>
      ))}
    </div>
  )
}
