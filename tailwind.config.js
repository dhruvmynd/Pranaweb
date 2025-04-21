/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      fontSize: {
        // Consistent heading sizes
        'display': ['4.5rem', { lineHeight: '1.1', fontWeight: '300' }],
        'h1': ['3.75rem', { lineHeight: '1.2', fontWeight: '300' }],
        'h2': ['3rem', { lineHeight: '1.2', fontWeight: '300' }],
        'h3': ['2.25rem', { lineHeight: '1.3', fontWeight: '300' }],
        'h4': ['1.875rem', { lineHeight: '1.4', fontWeight: '300' }],
        // Body text sizes
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'base': ['1rem', { lineHeight: '1.75' }],
        'sm': ['0.875rem', { lineHeight: '1.5625' }]
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            'h1, h2, h3, h4': {
              color: 'hsl(var(--foreground))',
              fontWeight: '300',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};