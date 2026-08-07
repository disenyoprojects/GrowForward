import { PolicyPage } from '@/components/site/PolicyPage'
import { getTerms } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const terms = getTerms()

export const metadata = pageMetadata(
  terms.status,
  'Terms of service — GrowForward',
  'The terms you agree to when you order a GrowForward basket.',
)

export default function TermsPage() {
  return <PolicyPage policy={terms} />
}
