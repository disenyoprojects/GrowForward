import Link from 'next/link'
import { getSite } from '@/lib/content'
import { Logo } from './Logo'

export function Footer() {
  const { footerTagline, footerColumns, partnershipLine, copyright } = getSite()

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="tag">{footerTagline}</p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{partnershipLine}</span>
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  )
}
