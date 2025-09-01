# Flujo de Trabajo del Sitio Web: De Cambios Locales a Sitio en Vivo

Este documento describe el proceso para actualizar el sitio web, desde realizar cambios locales hasta desplegarlos en el sitio en vivo en GitHub Pages.

## 1. Ejecutar el Sitio Web Localmente

Para ver tus cambios localmente antes de subirlos a GitHub, necesitas ejecutar el servidor de desarrollo.

1.  **Abre una terminal** en el directorio del proyecto (`/Users/matias/lab/pagina`).
2.  **Ejecuta el siguiente comando:**
    ```bash
    npm install && npx vite --port 3002
    ```
3.  **Abre tu navegador** y ve a `http://localhost:3002`.

El servidor recargará automáticamente la página cuando hagas cambios en los archivos.

## 2. Añadir Nuevo Contenido

Aquí está el flujo de trabajo simplificado para añadir nuevos artículos o proyectos.

### 2.1. Crea tus Archivos de Contenido

1.  **Crea tus archivos markdown** para el nuevo contenido (ej. `mi-nuevo-articulo_ES.md` y `mi-nuevo-articulo_EN.md`).
2.  **Colócalos** en la carpeta de contenido apropiada (`src/content/projects` o `src/content/writing`).
3.  **Si tienes un archivo HTML para incrustar**, colócalo en la misma carpeta que tus archivos markdown.

### 2.2. Incrustar Contenido HTML (Opcional)

Para incrustar un archivo HTML en tu markdown, usa la etiqueta `[embed]`.

**Para un archivo HTML local:**

```
[embed:mi-visualizacion.html, width=800px, height=600px]
```

*   `mi-visualizacion.html`: El nombre de tu archivo HTML (debe estar en la misma carpeta).
*   `width` y `height` son opcionales. Si no se proporcionan, los valores por defecto serán `100%` y `800px`.

**Para un archivo HTML externo:**

```
[embed:https://example.com/mi-visualizacion.html, width=100%, height=600px]
```

## 3. Desplegar en GitHub Pages

El proceso de despliegue está automatizado con GitHub Actions.

### 3.1. Configuración Única

1.  **Enlaza tu repositorio local a GitHub:**
    ```bash
    git remote add origin https://github.com/nunezmatias/pagina.git
    ```
    (Esto ya se ha hecho).
2.  **Configura GitHub Pages:**
    *   Go to your repository's settings on GitHub.
    *   Navigate to the "Pages" section.
    *   Select the `gh-pages` branch as the source for your website.
    *   Save the changes.

### 3.2. Flujo de Trabajo Regular

1.  **Confirma tus cambios:**
    ```bash
    git add .
    git commit -m "Tu mensaje de commit"
    ```
2.  **Sube a GitHub:**
    ```bash
    git push origin pinerest
    ```
    Esto activará el flujo de trabajo de GitHub Actions, que construirá y desplegará automáticamente tu sitio. Los cambios deberían estar en vivo en unos minutos.

## 4. Solución de Problemas: Contenido Faltante en GitHub Pages

**Problema:** El sitio web carga, pero las tarjetas de contenido no aparecen. En la consola, se ven errores 404 para `directory-listing.json`. Localmente, todo funciona.

**Causa Principal:** Los archivos `directory-listing.json` (necesarios para el auto-descubrimiento de contenido) no se están incluyendo correctamente en el despliegue final de GitHub Pages.

**Plan de Acción (Pasos Clave):**

1.  **Asegurar que `directory-listing.json` se genere y copie correctamente:**
    *   Modificar `generate-directory-listing.js` para que guarde los JSON en `src/public/content/`.
    *   Configurar `vite.config.js` para que use `src/public` como directorio público.
    *   Eliminar el paso `Copy Content to Dist` de `deploy.yml` (Vite lo hará automáticamente).

2.  **Ajustar rutas de carga de contenido:**
    *   Verificar que `BilingualContentLoader` (en `src/js/content-loader-bilingual-fixed-clean.js`) use las rutas correctas para GitHub Pages (ej. `/pagina/content/projects/`).

**Detalle de Modificaciones:**

*   **`generate-directory-listing.js`:** Cambiar la ruta de salida de los JSON a `src/public/content/`.
*   **`vite.config.js`:** Añadir `publicDir: 'src/public'` dentro de `defineConfig`.
*   **`src/js/content-loader-bilingual-fixed-clean.js`:** Asegurar que las llamadas `fetch` a los archivos `.json` y `.md` usen la ruta base correcta (ej. `/pagina/content/projects/`).
*   **`.github/workflows/deploy.yml`:** Eliminar el paso `Copy Content to Dist`.