// Night Mode Simple - Funciona en página principal y contenidos
class SimpleNightMode {
    constructor() {
        // SIEMPRE iniciar en modo claro al recargar la página
        this.isNightMode = false;
        localStorage.setItem('simpleNightMode', 'false');
        this.init();
    }

    init() {
        this.createToggleButton();
        // SIEMPRE aplicar estilos de modo claro primero
        this.applyDefaultLightStyles();
        if (this.isNightMode) {
            this.enableNightMode();
        }
    }

    applyDefaultLightStyles() {
        const styleId = 'default-light-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            /* ===== ESTILOS POR DEFECTO - MODO CLARO ===== */
            /* Forzar páginas de contenido a modo claro por defecto */
            
            #content-page {
                background: linear-gradient(to bottom right, #f7fafc, #ffffff) !important;
                color: #2d3748 !important;
                transition: all 0.4s ease !important;
            }

            #content-page header {
                background: rgba(255, 255, 255, 0.9) !important;
                border-color: #e2e8f0 !important;
                backdrop-filter: blur(8px) !important;
                transition: all 0.4s ease !important;
            }

            #content-page header a,
            #content-page header button,
            #content-page nav a,
            #content-page nav button {
                color: #2d3748 !important;
                transition: color 0.4s ease !important;
            }

            #content-page h1,
            #content-page h2,
            #content-page h3,
            #content-page .prose h1,
            #content-page .prose h2,
            #content-page .prose h3,
            #content-page .cv-content h1,
            #content-page .cv-content h2,
            #content-page .cv-content h3 {
                color: #2d3748 !important;
                transition: color 0.4s ease !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                text-shadow: none !important;
            }

            #content-page p,
            #content-page li,
            #content-page .prose p,
            #content-page .prose li,
            #content-page .cv-content p,
            #content-page .cv-content li {
                color: #4a5568 !important;
                transition: color 0.4s ease !important;
            }

            #content-page strong,
            #content-page .prose strong,
            #content-page .cv-content strong {
                color: #2d3748 !important;
                transition: color 0.4s ease !important;
            }

            #content-page code,
            #content-page .prose code,
            #content-page .cv-content code {
                background-color: #f7fafc !important;
                color: #2d3748 !important;
                transition: all 0.4s ease !important;
            }
        `;
    }

    createToggleButton() {
        // Remover botón existente si existe
        const existingButton = document.getElementById('simple-night-toggle');
        if (existingButton) {
            existingButton.remove();
        }

        const toggleButton = document.createElement('button');
        toggleButton.id = 'simple-night-toggle';
        toggleButton.className = 'fixed bottom-4 right-4 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent-light transition-all duration-300 z-50';
        
        this.updateButtonIcon(toggleButton);
        toggleButton.addEventListener('click', () => this.toggle());
        
        document.body.appendChild(toggleButton);
    }

    updateButtonIcon(button) {
        const moonIcon = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
        `;
        
        const sunIcon = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
        `;

        button.innerHTML = this.isNightMode ? sunIcon : moonIcon;
        button.title = this.isNightMode ? 'Modo día' : 'Modo noche';
    }

    toggle() {
        this.isNightMode = !this.isNightMode;
        localStorage.setItem('simpleNightMode', this.isNightMode.toString());
        
        if (this.isNightMode) {
            this.enableNightMode();
        } else {
            this.disableNightMode();
        }
        
        const button = document.getElementById('simple-night-toggle');
        if (button) {
            this.updateButtonIcon(button);
        }
    }

    enableNightMode() {
        document.documentElement.classList.add('night-mode');
        document.documentElement.classList.add('dark'); // Para compatibilidad con Tailwind
        this.applyNightModeStyles();
    }

    disableNightMode() {
        document.documentElement.classList.remove('night-mode');
        document.documentElement.classList.remove('dark'); // Para compatibilidad con Tailwind
        this.removeNightModeStyles();
    }

    applyNightModeStyles() {
        const styleId = 'simple-night-mode-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            /* Night Mode Styles - Transiciones mejoradas */
            .night-mode {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Transiciones suaves para todos los elementos */
            .night-mode *,
            .night-mode *::before,
            .night-mode *::after {
                transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                           box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            /* ===== PÁGINA PRINCIPAL ===== */
            .night-mode body {
                background-color: #1a202c !important;
                color: #e2e8f0 !important;
            }

            /* ARREGLAR: Header visible en modo oscuro */
            .night-mode header,
            .night-mode .bg-white\/90 {
                background-color: rgba(26, 32, 44, 0.95) !important;
                backdrop-filter: blur(8px);
            }

            /* ARREGLAR: Texto del header visible en todas las resoluciones */
            .night-mode header a,
            .night-mode header button,
            .night-mode nav a,
            .night-mode nav button,
            .night-mode .font-medium {
                color: #63b3ed !important;
            }

            .night-mode header .font-serif {
                color: #63b3ed !important;
            }

            .night-mode header .font-medium:hover {
                color: #93c5fd !important;
            }

            /* ARREGLAR: Header responsive - elementos visibles en resoluciones menores */
            @media (max-width: 1024px) {
                /* Forzar visibilidad de elementos desktop en tablet */
                .night-mode .hidden.lg\\:flex {
                    display: flex !important;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
            }

            @media (max-width: 768px) {
                /* Asegurar que elementos móviles sean visibles */
                .night-mode .lg\\:hidden {
                    display: flex !important;
                    align-items: center;
                    gap: 1rem;
                }
                
                /* Botones de idioma móviles visibles en night mode */
                .night-mode .lg\\:hidden .border.border-gray-200 {
                    border-color: #4a5568 !important;
                    background-color: rgba(26, 32, 44, 0.8) !important;
                }

                /* Texto en botones móviles visible */
                .night-mode .lg\\:hidden button {
                    color: #63b3ed !important;
                }
            }

            /* ARREGLAR: Botones de idioma visibles en night mode */
            .night-mode .border-gray-200 {
                border-color: #4a5568 !important;
            }

            .night-mode .bg-accent {
                background-color: #63b3ed !important;
            }

            .night-mode .hover\\:bg-gray-100:hover {
                background-color: rgba(99, 179, 237, 0.1) !important;
            }

            /* ARREGLAR: Mobile menu en night mode */
            .night-mode .lg\\:hidden button,
            .night-mode .md\\:hidden button {
                color: #63b3ed !important;
            }

            /* Secciones blancas -> gris oscuro */
            .night-mode .bg-white {
                background-color: #2d3748 !important;
            }

            .night-mode .bg-gray-50 {
                background-color: #1a202c !important;
            }

            /* Hero Section - Texto más claro y elegante */
            .night-mode .text-light {
                color: #f7fafc !important;
            }

            .night-mode h1 {
                color: #f7fafc !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }

            /* Textos principales */
            .night-mode .text-gray-900 {
                color: #e2e8f0 !important;
            }

            .night-mode .text-gray-800 {
                color: #cbd5e1 !important;
            }

            .night-mode .text-gray-700 {
                color: #a0aec0 !important;
            }

            .night-mode .text-gray-600 {
                color: #718096 !important;
            }

            /* Bordes */
            .night-mode .border-gray-200 {
                border-color: #4a5568 !important;
            }

            /* Tarjetas Pinterest - Elegantes */
            .night-mode .pinterest-card {
                background-color: #2d3748 !important;
                border: 1px solid #4a5568;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .night-mode .pinterest-card .bg-gradient-to-br {
                background: linear-gradient(to bottom right, #2d3748, #4a5568, #718096) !important;
            }

            /* ARREGLAR: Texto en tarjetas más claro y legible */
            .night-mode .pinterest-card h3,
            .night-mode .pinterest-card .font-serif {
                color: #f7fafc !important;
            }

            .night-mode .pinterest-card p,
            .night-mode .pinterest-card .text-gray-600 {
                color: #cbd5e1 !important;
            }

            /* ARREGLAR: Botón "Leer más" / "Read more" visible */
            .night-mode .pinterest-card button,
            .night-mode .pinterest-card .text-accent {
                color: #ffffff !important;
                font-weight: 600;
            }

            .night-mode .pinterest-card button:hover,
            .night-mode .pinterest-card .text-accent:hover {
                color: #e2e8f0 !important;
            }

            /* ARREGLAR: Fondo de la sección inferior de tarjetas */
            .night-mode .pinterest-card .bg-gradient-to-br.from-gray-100,
            .night-mode .pinterest-card div[class*="bg-gradient-to-br"] {
                background: linear-gradient(to bottom right, #374151, #4a5568, #6b7280) !important;
            }

            /* ARREGLAR: Todos los textos en tarjetas más específicos */
            .night-mode .pinterest-card .text-sm,
            .night-mode .pinterest-card .text-gray-600.text-sm {
                color: #cbd5e1 !important;
            }

            /* ARREGLAR: Botones y enlaces en tarjetas más específicos */
            .night-mode .pinterest-card .inline-flex.items-center,
            .night-mode .pinterest-card button.text-accent,
            .night-mode .pinterest-card .group {
                color: #ffffff !important;
                font-weight: 600 !important;
            }

            .night-mode .pinterest-card .inline-flex.items-center:hover,
            .night-mode .pinterest-card button.text-accent:hover {
                color: #e2e8f0 !important;
            }

            /* Section titles */
            .night-mode .section-title {
                color: #63b3ed !important;
            }

            /* ARREGLAR: "Conéctate" debe tener el mismo color que "Contacto" */
            .night-mode h3,
            .night-mode .section-title,
            .night-mode h2.section-title {
                color: #63b3ed !important;
            }

            /* ARREGLAR: Ícono LinkedIn visible en modo oscuro */
            .night-mode .bg-white.rounded-lg.shadow-sm,
            .night-mode a.bg-white {
                background-color: #e2e8f0 !important;
                color: #2d3748 !important;
            }

            .night-mode .bg-white.rounded-lg.shadow-sm:hover,
            .night-mode a.bg-white:hover {
                background-color: #cbd5e1 !important;
            }

            /* ===== PÁGINAS DE CONTENIDO - LÓGICA CORREGIDA ===== */
            


            /* SEGUNDO: Solo cuando hay NIGHT MODE, cambiar a oscuro */
            .night-mode #content-page {
                background: linear-gradient(to bottom right, #1a202c, #2d3748) !important;
                color: #e2e8f0 !important;
                transition: all 0.4s ease !important;
            }

            .night-mode #content-page header {
                background: rgba(26, 32, 44, 0.95) !important;
                border-color: #4a5568 !important;
                backdrop-filter: blur(8px);
                transition: all 0.4s ease !important;
            }

            .night-mode #content-page header a,
            .night-mode #content-page header button,
            .night-mode #content-page nav a,
            .night-mode #content-page nav button {
                color: #63b3ed !important;
                transition: color 0.4s ease !important;
            }

            /* ARREGLAR: Eliminar todos los recuadros y bordes de títulos */
            .night-mode h1,
            .night-mode h2,
            .night-mode h3,
            .night-mode h4,
            .night-mode h5,
            .night-mode h6,
            .night-mode #content-page h1,
            .night-mode #content-page h2,
            .night-mode #content-page h3,
            .night-mode #content-page .prose h1,
            .night-mode #content-page .prose h2,
            .night-mode #content-page .prose h3,
            .night-mode #content-page .cv-content h1,
            .night-mode #content-page .cv-content h2,
            .night-mode #content-page .cv-content h3,
            .night-mode .section-title,
            .night-mode .font-serif {
                color: #63b3ed !important;
                transition: color 0.4s ease !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                text-shadow: none !important;
                text-decoration: none !important;
                background: none !important;
                background-color: transparent !important;
                background-image: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* ELIMINAR COMPLETAMENTE la línea decorativa de .section-title */
            .night-mode h1::before,
            .night-mode h1::after,
            .night-mode h2::before,
            .night-mode h2::after,
            .night-mode h3::before,
            .night-mode h3::after,
            .night-mode .section-title::before,
            .night-mode .section-title::after,
            .night-mode #content-page .section-title::after,
            .night-mode #content-page h1::after,
            .night-mode #content-page h2::after,
            .night-mode #content-page h3::after {
                content: "" !important;
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
                background: transparent !important;
                background-color: transparent !important;
                background-image: none !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                position: static !important;
            }
            
            /* Forzar eliminación de la línea decorativa con máxima especificidad */
            html .night-mode .section-title::after,
            html .night-mode #content-page .section-title::after {
                content: none !important;
                display: none !important;
            }

            .night-mode #content-page p,
            .night-mode #content-page li,
            .night-mode #content-page .prose p,
            .night-mode #content-page .prose li,
            .night-mode #content-page .cv-content p,
            .night-mode #content-page .cv-content li {
                color: #cbd5e1 !important;
                transition: color 0.4s ease !important;
            }

            .night-mode #content-page strong,
            .night-mode #content-page .prose strong,
            .night-mode #content-page .cv-content strong {
                color: #e2e8f0 !important;
                transition: color 0.4s ease !important;
            }

            .night-mode #content-page code,
            .night-mode #content-page .prose code,
            .night-mode #content-page .cv-content code {
                background-color: #4a5568 !important;
                color: #e2e8f0 !important;
                transition: all 0.4s ease !important;
            }

            .night-mode #content-page hr,
            .night-mode #content-page .prose hr,
            .night-mode #content-page .cv-content hr {
                border-color: #4a5568 !important;
            }

            /* ===== FORMULARIOS ===== */
            .night-mode input,
            .night-mode textarea {
                background-color: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .night-mode input:focus,
            .night-mode textarea:focus {
                border-color: #63b3ed !important;
                box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.1);
            }

            /* ===== BOTONES ===== */
            .night-mode .btn-primary {
                background: linear-gradient(to right, #2b6cb0, #3182ce) !important;
            }

            .night-mode .hover\\:text-accent:hover {
                color: #63b3ed !important;
            }


        `;
    }

    removeNightModeStyles() {
        const styleElement = document.getElementById('simple-night-mode-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que otros scripts se carguen
    setTimeout(() => {
        window.simpleNightMode = new SimpleNightMode();
    }, 500);
});

// Función para reinicializar el botón en páginas de contenido
function reinitNightModeButton() {
    if (window.simpleNightMode) {
        window.simpleNightMode.createToggleButton();
    }
}