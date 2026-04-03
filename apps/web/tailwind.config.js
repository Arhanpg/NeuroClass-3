/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // NeuroClass design tokens — map CSS vars to Tailwind
        'nc-bg':            'var(--color-bg)',
        'nc-surface':       'var(--color-surface)',
        'nc-surface-2':     'var(--color-surface-2)',
        'nc-surface-offset':'var(--color-surface-offset)',
        'nc-divider':       'var(--color-divider)',
        'nc-border':        'var(--color-border)',
        'nc-text':          'var(--color-text)',
        'nc-muted':         'var(--color-text-muted)',
        'nc-faint':         'var(--color-text-faint)',
        'nc-primary':       'var(--color-primary)',
        'nc-primary-hover': 'var(--color-primary-hover)',
        'nc-error':         'var(--color-error)',
        'nc-success':       'var(--color-success)',
        'nc-warning':       'var(--color-warning)',
      },
      fontFamily: {
        sans:    ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
