/** @type {import('tailwindcss').Config} */
export default {
  // Active le mode dark basé sur la classe HTML
  darkMode: ['class'],
  // ⚠️ CRITIQUE : le content vide empêchait Tailwind de générer TOUTE classe CSS
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Intégration des tokens de design existants de index.css
      colors: {
        accent:  'var(--accent)',
        border:  'var(--border)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        // Couleurs Shadcn/ui standard mappées sur vos variables CSS
        primary: {
          DEFAULT: '#aa3bff',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--accent-bg)',
          foreground: 'var(--text-h)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--code-bg)',
          foreground: 'var(--text)',
        },
        card: {
          DEFAULT: 'var(--bg)',
          foreground: 'var(--text-h)',
        },
        popover: {
          DEFAULT: 'var(--bg)',
          foreground: 'var(--text-h)',
        },
        input: 'var(--border)',
        ring: 'var(--accent)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: 'rgba(0,0,0,.08) 0 4px 16px',
        'card-hover': 'rgba(170,59,255,.15) 0 8px 24px',
      },
      animation: {
        'fade-in': 'fadeIn .25s ease',
        'slide-up': 'slideUp .3s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};