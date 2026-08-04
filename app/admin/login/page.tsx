import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin/auth'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect('/admin')
  }

  return (
    <div className="admin-login">
      <h1>Sign in</h1>
      <p className="admin-muted">
        Staff accounts are created by an administrator. There is no signup.
      </p>
      <LoginForm />
    </div>
  )
}
