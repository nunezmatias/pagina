# Guía de Deploy

## Opción 1: Netlify (Recomendado)

1. Sube tu código a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Conecta tu repositorio de GitHub
4. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy automático en cada push

## Opción 2: Vercel

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Vercel detecta automáticamente la configuración
5. Deploy automático en cada push

## Opción 3: GitHub Pages

1. En tu repositorio de GitHub, ve a Settings > Pages
2. Selecciona "GitHub Actions" como source
3. Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Configuración de dominio personalizado

En cualquiera de las opciones anteriores, puedes configurar tu dominio personalizado en la configuración de la plataforma.