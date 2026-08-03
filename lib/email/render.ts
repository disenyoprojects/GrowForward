import { templates, type TemplateName } from './templates'

export type MergeVars = Readonly<Record<string, string | undefined>>

const MERGE_TAG_PATTERN = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi
const RELATIVE_ASSET_PATTERN = /(src|href)="assets\/images\/([^"]+)"/g

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escapes values before they are substituted into template HTML.
 *
 * Merge values are customer-supplied — a gift message containing `<script>` or
 * a stray quote would otherwise break out of the surrounding markup.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character])
}

/**
 * Rewrites the templates' relative image paths to absolute URLs.
 *
 * Email clients have no page context to resolve `assets/images/...` against,
 * so every asset must be a fully qualified HTTPS URL.
 */
function absolutizeAssets(html: string, siteUrl: string): string {
  return html.replace(
    RELATIVE_ASSET_PATTERN,
    (_match, attribute: string, file: string) =>
      `${attribute}="${siteUrl}/email/images/${file}"`,
  )
}

export interface RenderedEmail {
  readonly subject: string
  readonly html: string
  /** Tags present in the template that the caller did not supply. */
  readonly missingTags: readonly string[]
}

/**
 * Fills a template's `{{merge_tags}}` and returns sendable HTML.
 *
 * Missing tags are replaced with an empty string rather than left visible —
 * a customer should never receive an email containing a literal `{{tag}}` —
 * and reported back so callers can log the gap.
 */
export function renderTemplate(
  name: TemplateName,
  vars: MergeVars,
  options: { siteUrl?: string } = {},
): RenderedEmail {
  const template = templates[name]

  if (!template) {
    throw new Error(`Unknown email template: ${name}`)
  }

  const siteUrl = (
    options.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    ''
  ).replace(/\/$/, '')

  const missingTags = new Set<string>()

  const substitute = (input: string): string =>
    input.replace(MERGE_TAG_PATTERN, (_match, tag: string) => {
      const value = vars[tag]

      if (value === undefined || value === '') {
        missingTags.add(tag)
        return ''
      }

      return escapeHtml(value)
    })

  return {
    subject: substitute(template.subject),
    html: absolutizeAssets(substitute(template.html), siteUrl),
    missingTags: [...missingTags],
  }
}
