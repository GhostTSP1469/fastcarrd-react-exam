import type { JSX } from 'react'

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: JSX.Element
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 max-[780px]:flex-col max-[780px]:items-stretch" data-aos="fade-up">
      <div>
        <div className="flex items-center gap-3 text-sm font-bold text-[#db4444]">
          <span className="h-10 w-5 rounded bg-[#db4444]" />
          {eyebrow}
        </div>
        <h2 className="mt-[18px] text-4xl font-semibold leading-tight max-[780px]:text-[28px]">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
