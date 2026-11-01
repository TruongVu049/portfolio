import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.js'],
    coverage: {
      provider: 'v8',
      // Logic and content modules; the WebGL and animation-heavy visuals are checked by eye.
      include: [
        'src/data/**',
        'src/hooks/useCaseStudyRoute.js',
        'src/components/contact/contactValidation.js',
        'src/components/contact/ContactForm.jsx',
        'src/components/skills/bubblePhysics.js',
        'src/components/projects/visuals/**',
        'src/components/projects/ArchitectureFlow.jsx',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
