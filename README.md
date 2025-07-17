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

## 📝 Gestión de Contenido Bilingüe

### Agregar Nuevo Contenido

El sitio usa un sistema automático de detección de contenido bilingüe. Para agregar nuevo contenido:

#### 1. Crear archivos markdown
```bash
# Para proyectos
src/content/projects/mi-nuevo-proyecto_ES.md
src/content/projects/mi-nuevo-proyecto_EN.md

# Para artículos/escritos
src/content/writing/mi-nuevo-articulo_ES.md
src/content/writing/mi-nuevo-articulo_EN.md
```

#### 2. Formato de archivos
Cada archivo debe tener frontmatter:
```markdown
---
title: "Título del Proyecto"
date: "2024-01-15"
category: "AI"
tags: ["AI", "Machine Learning"]
excerpt: "Descripción breve del proyecto..."
---

# Contenido del proyecto

Tu contenido aquí...
```

#### 3. Actualizar sistema
```bash
npm run scan-content
```

#### 4. Ver cambios
Refresca la página - el nuevo contenido aparecerá automáticamente.

### Contenido Actual
- **Proyectos**: 5 pares bilingües (remote-sensing, chatbot-ela-static, etc.)
- **Escritos**: 5 pares bilingües (felix, ai-epistemological-lens, etc.)

### Comandos Útiles
```bash
npm run scan-content    # Escanear nuevo contenido
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
```

## 📝 Modificaciones Comunes

### Cambiar contenido estático
- Edita `src/index.html`
- Las imágenes van en `src/assets/images/`

### Cambiar estilos
- Modifica las clases de Tailwind en el HTML
- Estilos custom en `src/assets/css/style.css`

### Agregar funcionalidad
- JavaScript en `src/assets/js/app.js`