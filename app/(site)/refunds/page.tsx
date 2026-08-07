import { PolicyPage } from '@/components/site/PolicyPage'
import { getRefunds } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const refunds = getRefunds()

export const metadata = pageMetadata(
  refunds.status,
  'Refunds and returns — GrowForward',
  'What happens if a basket arrives damaged, late, or not as expected.',
)

export default function RefundsPage() {
  return <PolicyPage policy={refunds} />
}
