import { PolicyPage } from '@/components/site/PolicyPage'
import { getPrivacy } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const privacy = getPrivacy()

export const metadata = pageMetadata(
  privacy.status,
  'Privacy — GrowForward',
  'What we collect when you send a gift, who handles it, and how to reach us about it.',
)

export default function PrivacyPage() {
  return <PolicyPage policy={privacy} />
}
