# Portfolio de Matias Núñez

Portfolio personal de investigador interdisciplinario en IA, machine learning y sistemas complejos.

## 🚀 Desarrollo Local

### Requisitos
- Node.js (v16 o superior)
- Git

### Instalación
```bash
git clone <tu-repo>
cd portfolio-matias
npm install
```

### Desarrollo
```bash
npm run dev
```
Abre http://localhost:3000 para ver la página en desarrollo.

### Build para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
portfolio-matias/
├── src/
│   ├── index.html          # Página principal
│   ├── assets/
│   │   ├── images/         # Imágenes del sitio
│   │   ├── css/           # Estilos personalizados
│   │   └── js/            # JavaScript personalizado
├── dist/                   # Archivos compilados (auto-generado)
├── package.json
└── vite.config.js         # Configuración de Vite
```

## 🔄 Flujo de Trabajo

1. **Modificar código**: Edita archivos en `src/`
2. **Ver cambios**: `npm run dev` - se actualiza automáticamente
3. **Build**: `npm run build` cuando estés listo
4. **Commit**: `git add . && git commit -m "descripción"`
5. **Deploy**: Push al repo y se actualiza automáticamente

## 🌐 Deploy

### Opciones recomendadas:
- **Netlify**: Deploy automático desde GitHub
- **Vercel**: Deploy automático desde GitHub  
- **GitHub Pages**: Gratis con GitHub Actions

## 📝 Modificaciones Comunes

### Cambiar contenido
- Edita `src/index.html`
- Las imágenes van en `src/assets/images/`

### Cambiar estilos
- Modifica las clases de Tailwind en el HTML
- Estilos custom en `src/assets/css/style.css`

### Agregar funcionalidad
- JavaScript en `src/assets/js/app.js`