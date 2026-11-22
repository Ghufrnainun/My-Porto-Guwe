import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      transitionTimingFunction: {
        'smooth-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
        town: 'cubic-bezier(.2, .9, .2, 1)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        blink: 'blink 1s step-end infinite',
        'town-sheet': 'town-sheet .6s cubic-bezier(.2, .9, .2, 1)',
        'town-row': 'town-row .6s cubic-bezier(.2, .9, .2, 1) both',
      },
      keyframes: {
        'town-sheet': {
          from: { transform: 'translateY(100%)' },
        },
        'town-row': {
          from: { transform: 'translateY(40px)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      fontFamily: {
        anton: ['Anton', 'Impact', 'sans-serif'],
        accent: ['Instrument Serif', 'Georgia', 'serif'],
        grotesk: ['Schibsted Grotesk', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', "'Plus Jakarta Sans'", 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        town: {
          paper: '#f3f1ea',
          ink: '#141414',
          blue: '#1f3bff',
          yellow: '#ffd60a',
          pink: '#ff8fc7',
          green: '#19b866',
          red: '#ff4a2b',
          night: '#0e1020',
          nightpanel: '#181b36',
          // swap between day and night on the .town root
          bg: 'var(--town-bg)',
          fg: 'var(--town-fg)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Town page media variants. Variants, not `screens`: raw screens would switch off every max-* variant.
    plugin(({ addVariant }) => {
      // narrow or short windows: bottom sheets instead of side panels
      addVariant('sheet', '@media (max-width: 899px), (max-height: 620px)');
      // the opposite: big enough for side panels
      addVariant('wide', '@media (min-width: 900px) and (min-height: 621px)');
      // a mouse or trackpad: small controls are fine, no 44px touch minimum
      addVariant('fine', '@media (hover: hover) and (pointer: fine)');
      // can drive: fine pointer and a keyboard-sized window (same rule as useTour)
      addVariant('drive', '@media (hover: hover) and (pointer: fine) and (min-width: 900px) and (min-height: 621px)');
    }),
  ],
};
