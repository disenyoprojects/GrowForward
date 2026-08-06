'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { NavLink } from '@/lib/content'

interface MobileNavProps {
  readonly links: readonly NavLink[]
  readonly cta: NavLink
}

/**
 * The menu for phone-width screens.
 *
 * The full row of links needs about 775px. Below that it ran off the edge of the
 * screen and was clipped, so "How It Works", "Guide", "About" and the Shop
 * Collection button simply could not be reached on a phone. This replaces the
 * row with a button that opens the same links stacked.
 *
 * The desktop row is still rendered and hidden by CSS below 900px. `display:
 * none` removes it from the accessibility tree too, so a screen reader is never
 * offered both copies.
 */
export function MobileNav({ links, cta }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Close after navigating. Links like `/#how-it-works` do not change the
  // pathname when you are already on that page, so the panel also closes on any
  // click inside it — otherwise the menu would stay open over the section it
  // just jumped to. This handles what a click cannot: the back button, which
  // changes the route with the panel still open.
  //
  // Adjusted during render rather than in an effect. An effect would paint the
  // open panel over the new page first and only then close it, which is a
  // visible flash — and React's own guidance is to reset state this way.
  const [renderedPath, setRenderedPath] = useState(pathname)

  if (pathname !== renderedPath) {
    setRenderedPath(pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    // The page behind the panel must not scroll under it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>

      <div
        id="mobile-nav"
        className={isOpen ? 'mobile-nav is-open' : 'mobile-nav'}
      >
        {/* Any click in here closes the panel — a link because it navigated,
            the background because that is what tapping away should do. */}
        <div className="mobile-nav-inner" onClick={() => setIsOpen(false)}>
          {links.map((link) => (
            <Link key={link.href + link.label} href={link.href}>
              {link.label}
            </Link>
          ))}

          <Link href={cta.href} className="btn btn-primary mobile-nav-cta">
            {cta.label}
          </Link>
        </div>
      </div>
    </>
  )
}
