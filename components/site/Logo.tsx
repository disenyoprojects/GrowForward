import { getSite } from '@/lib/content'

export function Logo() {
  const { brandPrefix, brandSuffix } = getSite()

  return (
    <div className="logo">
      {brandPrefix}
      <span>{brandSuffix}</span>
    </div>
  )
}
