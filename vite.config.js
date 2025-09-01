import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  // Detectar si estamos en modo build para GitHub Pages
  const isGitHubPages = process.env.GITHUB_PAGES === 'true'
  
  return {
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true
    },
    server: {
      port: 3000,
      open: true
    },
    // Usar base path dinámico basado en el entorno
    base: isGitHubPages ? '/pagina/' : './'
  }
})