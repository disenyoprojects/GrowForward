import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'

/**
 * Chrome for the public site.
 *
 * Split out from the root layout so /admin can render without the marketing
 * header and footer. Route groups do not appear in URLs, so every path here is
 * unchanged.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
