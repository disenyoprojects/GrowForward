/**
 * Creates or updates a staff account for /admin.
 *
 * There is no public signup — this script is the only way an account comes into
 * existence. Run it once to create the first ADMIN, then again for each member
 * of staff.
 *
 *   npm run admin:create -- --email you@destinevents.biz --name "Your Name" --role ADMIN
 *
 * The password is read from the terminal rather than passed as an argument, so
 * it never lands in shell history or in the process list.
 */

import 'dotenv/config'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { db } from '../lib/db'
import { MIN_PASSWORD_LENGTH, hashPassword } from '../lib/admin/password'
import type { AdminRole } from '../lib/generated/prisma/client'

interface Args {
  readonly email: string
  readonly name: string
  readonly role: AdminRole
}

function parseArgs(argv: readonly string[]): Args {
  const get = (flag: string): string | undefined => {
    const index = argv.indexOf(`--${flag}`)
    return index === -1 ? undefined : argv[index + 1]
  }

  const email = get('email')?.trim().toLowerCase()
  const name = get('name')?.trim()
  const role = (get('role')?.trim().toUpperCase() ?? 'STAFF') as AdminRole

  if (!email || !email.includes('@')) {
    throw new Error('Pass a valid --email.')
  }

  if (!name) {
    throw new Error('Pass a --name.')
  }

  if (role !== 'ADMIN' && role !== 'STAFF') {
    throw new Error('--role must be ADMIN or STAFF.')
  }

  return { email, name, role }
}

/**
 * Reads the password from the terminal, or from a pipe when there isn't one.
 *
 * Piped input is read whole rather than through readline: readline can emit a
 * second line before the second `question` is registered, and the prompt then
 * waits forever for input that has already gone by.
 */
async function readPassword(): Promise<string> {
  if (!stdin.isTTY) {
    let piped = ''
    for await (const chunk of stdin) {
      piped += chunk
    }

    const password = piped.split('\n')[0]?.trim() ?? ''

    if (!password) {
      throw new Error('No password arrived on stdin.')
    }

    return password
  }

  const rl = createInterface({ input: stdin, output: stdout })

  try {
    const password = await rl.question(
      `Password (min ${MIN_PASSWORD_LENGTH} characters): `,
    )
    const again = await rl.question('Confirm password: ')

    if (password !== again) {
      throw new Error('The two passwords do not match.')
    }

    return password
  } finally {
    rl.close()
  }
}

async function main(): Promise<void> {
  const { email, name, role } = parseArgs(process.argv.slice(2))
  const existing = await db.adminUser.findUnique({ where: { email } })

  if (existing) {
    process.stdout.write(`${email} already exists — updating their password.\n`)
  }

  const passwordHash = await hashPassword(await readPassword())

  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, name, role },
    create: { email, name, role, passwordHash },
  })

  process.stdout.write(`\n${existing ? 'Updated' : 'Created'} ${role} ${email}.\n`)
}

main()
  .catch((error: unknown) => {
    process.stderr.write(`\n${error instanceof Error ? error.message : error}\n`)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
