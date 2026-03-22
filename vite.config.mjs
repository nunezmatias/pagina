import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command, mode }) => {
  // Detectar si estamos en modo build para GitHub Pages
  const isGitHubPages = process.env.GITHUB_PAGES === 'true'
  
  return {
    root: 'src',
    publicDir: 'src/public', // Explicitly set public directory
    build: {
      outDir: '../dist',
      emptyOutDir: true
    },
    server: {
      port: 3000,
      open: true
    },
    // Usar base path dinámico basado en el entorno
    base: isGitHubPages ? '/pagina/' : './',
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'content/**/*',
            dest: 'content'
          },
          {
            src: 'js/**/*',
            dest: 'js'
          }
        ]
      })
    ]
  }
})