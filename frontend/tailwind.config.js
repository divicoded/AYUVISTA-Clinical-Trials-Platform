/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 Expressive Tones for Healthcare / Ayush
        m3: {
          surface: '#F4FBF7', // Ultra light minty tinted canvas
          surfaceVariant: '#E1EFE7',
          surfaceContainer: '#FFFFFF',
          surfaceContainerHigh: '#F0F7F2',
          surfaceContainerHighest: '#E6EFE9',
          outline: '#D3E2D8',
          outlineVariant: '#E8F1EC',
          primary: '#0B4D3C', // Deep forest teal (AIIA Ayush Green)
          primaryHover: '#07382B',
          onPrimary: '#FFFFFF',
          primaryContainer: '#D1F2E2', // Mint pill
          onPrimaryContainer: '#043427',
          secondary: '#366556',
          secondaryContainer: '#D9EDE3',
          tertiary: '#934B00',
          tertiaryContainer: '#FFDCC1',
          error: '#BA1A1A',
          errorContainer: '#FFDAD6',
          onErrorContainer: '#410002',
          // Pastel Expressive Tonal Cards (from inspiration images)
          pastelMint: '#D7F5E8',
          pastelPink: '#FCE7F3',
          pastelYellow: '#FEF3C7',
          pastelBlue: '#E0F2FE',
          pastelPurple: '#EDE9FE',
          pastelOrange: '#FFEDD5',
        },
        clinical: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'm3-elevation-1': '0px 1px 3px 1px rgba(0, 48, 32, 0.05), 0px 1px 2px 0px rgba(0, 48, 32, 0.08)',
        'm3-elevation-2': '0px 2px 6px 2px rgba(0, 48, 32, 0.06), 0px 1px 2px 0px rgba(0, 48, 32, 0.09)',
        'm3-elevation-3': '0px 4px 12px 3px rgba(0, 48, 32, 0.07), 0px 1px 3px 0px rgba(0, 48, 32, 0.10)',
        'm3-soft': '0 8px 30px rgba(0, 40, 25, 0.04)',
      }
    },
  },
  plugins: [],
}
