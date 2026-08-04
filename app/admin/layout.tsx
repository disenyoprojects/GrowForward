import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminSession } from '@/lib/admin/auth'
import { logout } from './actions'
import './admin.css'

export const metadata: Metadata = {
  title: 'GrowForward Admin',
  robots: { index: false, follow: false },
}

/**
 * Admin chrome.
 *
 * The session read here drives the header only — it is not the access control.
 * Each page calls `requireAdminSession()` for that, because a server action can
 * be reached without ever rendering this layout.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession()

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link href="/admin" className="admin-brand">
          GrowForward <span>Admin</span>
        </Link>

        {session ? (
          <form action={logout} className="admin-bar-actions">
            <span className="admin-role">{session.role}</span>
            <button type="submit" className="admin-link-button">
              Sign out
            </button>
          </form>
        ) : null}
      </header>

      <main className="admin-main">{children}</main>
    </div>
  )
}
