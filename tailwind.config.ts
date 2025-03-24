import type { Config } from 'tailwindcss'
import { addDynamicIconSelectors } from '@iconify/tailwind'

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'normal-bg': '#ffffff',
        'dark-bg': '#1a202c',
      },
    },
  },
  plugins: [
    addDynamicIconSelectors(),
    addDynamicIconSelectors({
      prefix: 'icon-hover',
      overrideOnly: true,
    }),
  ],
} satisfies Config;