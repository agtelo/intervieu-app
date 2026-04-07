import nextEslintPlugin from '@next/eslint-plugin-next'

const config = [
  {
    plugins: {
      '@next/next': nextEslintPlugin,
    },
    rules: {
      ...nextEslintPlugin.configs.recommended.rules,
    },
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default config
