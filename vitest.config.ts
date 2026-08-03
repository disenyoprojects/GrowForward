import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['lib/generated/**', 'lib/email/templates/**'],
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
})
