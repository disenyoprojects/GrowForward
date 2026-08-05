import type { PageStatus } from '@/lib/content'

interface DraftNoticeProps {
  readonly status: PageStatus
}

/**
 * Says plainly that a page is not finished.
 *
 * Renders nothing once the page is published, so removing it is the same single
 * flag change that removes the `noindex`. Without this, a visitor reading
 * bracketed placeholder text has no way to tell whether it is a mistake or the
 * real wording — and anyone the founder shares the link with would assume it is
 * final.
 */
export function DraftNotice({ status }: DraftNoticeProps) {
  if (status === 'published') {
    return null
  }

  return (
    <div className="draft-notice" role="note">
      <div className="container">
        <strong>This page is still being written.</strong> Anything in square
        brackets is a placeholder, not our final wording.
      </div>
    </div>
  )
}
