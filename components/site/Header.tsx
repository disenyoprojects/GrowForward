import Link from 'next/link'
import { getSite } from '@/lib/content'
import { Logo } from './Logo'

export function Header() {
  const { navLinks, navCta } = getSite()

  return (
    <header>
      <nav>
        <Link href="/" aria-label="GrowForward home">
          <Logo />
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href={navCta.href} className="nav-cta">
          {navCta.label}
        </Link>
      </nav>
    </header>
  )
}
