// Fix para páginas de contenido - Agregar ID y reinicializar night mode
document.addEventListener('DOMContentLoaded', function() {
    // Observar cuando se crean nuevas páginas de contenido
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList && node.classList.contains('fixed')) {
                    // Es una página de contenido nueva
                    const contentDiv = node.querySelector('.min-h-screen');
                    if (contentDiv && !contentDiv.id) {
                        // Agregar ID para night mode
                        contentDiv.id = 'content-page';
                        contentDiv.classList.add('transition-colors', 'duration-300');
                        
                        // Agregar transiciones al header
                        const header = contentDiv.querySelector('header');
                        if (header) {
                            header.classList.add('transition-colors', 'duration-300');
                        }
                        
                        // Reinicializar botón de night mode y forzar estilos correctos
                        setTimeout(() => {
                            if (window.simpleNightMode) {
                                // FORZAR aplicación de estilos de modo claro primero
                                window.simpleNightMode.applyDefaultLightStyles();
                                
                                window.simpleNightMode.createToggleButton();
                                
                                // Solo aplicar night mode si está activo
                                if (window.simpleNightMode.isNightMode) {
                                    window.simpleNightMode.enableNightMode();
                                } else {
                                    // Asegurar que esté en modo claro
                                    window.simpleNightMode.disableNightMode();
                                }
                            }
                        }, 100);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});