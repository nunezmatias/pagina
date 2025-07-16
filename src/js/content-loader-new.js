// Sistema de carga de contenido COMPLETAMENTE NUEVO - SIN DUPLICACIONES
class SimpleContentLoader {
    constructor() {
        this.projects = [];
        this.articles = [];
        this.init();
    }

    async init() {
        console.log('Iniciando carga simple...');
        
        // Limpiar contenedores primero
        this.clearContainers();
        
        // Cargar contenido
        await this.loadContent();
        
        // Renderizar
        this.render();
    }

    clearContainers() {
        const projectsContainer = document.querySelector('#projects-container');
        const articlesContainer = document.querySelector('#writing-container');
        
        if (projectsContainer) projectsContainer.innerHTML = '';
        if (articlesContainer) articlesContainer.innerHTML = '';
    }

    async loadContent() {
        // Datos hardcodeados para evitar problemas de carga
        this.projects = [
            {
                title: "Chatbot para Comunicación ELA",
                excerpt: "Sistema de comunicación asistiva basado en IA para personas con ELA, integrando reconocimiento de gestos mínimos y generación de lenguaje natural."
            },
            {
                title: "Reconstrucción Lingüística con Embeddings", 
                excerpt: "Aplicación de modelos de embeddings para la reconstrucción y análisis de corpus lingüísticos históricos como el inglés antiguo."
            },
            {
                title: "Clustering de Datos de la ONU",
                excerpt: "Técnicas de reducción de dimensionalidad y clustering aplicadas a datos de Naciones Unidas para identificar patrones en indicadores de desarrollo sostenible."
            },
            {
                title: "Análisis de Teledetección",
                excerpt: "Análisis basado en física para interpretación de datos de teledetección, con aplicaciones en monitoreo ambiental y gestión de recursos naturales."
            }
        ];

        this.articles = [
            {
                title: "La inteligencia artificial como lente epistemológica",
                excerpt: "Reflexiones sobre cómo los modelos de IA nos ayudan a entender no solo el mundo, sino también nuestros propios procesos de conocimiento."
            },
            {
                title: "FELIX: Navegando la incertidumbre en aguas bravas",
                excerpt: "Reflexiones desde el río sobre la toma de decisiones bajo incertidumbre extrema y las lecciones que los rápidos de clase V nos enseñan sobre la vida."
            },
            {
                title: "Ríos como sistemas complejos",
                excerpt: "Notas de campo sobre la dinámica de fluidos en ríos de clase V y sus paralelos con sistemas adaptativos complejos."
            }
        ];
    }

    render() {
        this.renderProjects();
        this.renderArticles();
    }

    renderProjects() {
        const container = document.querySelector('#projects-container');
        if (!container) return;

        this.projects.forEach(project => {
            const card = this.createCard(project, 'project');
            container.appendChild(card);
        });
    }

    renderArticles() {
        const container = document.querySelector('#writing-container');
        if (!container) return;

        this.articles.forEach(article => {
            const card = this.createCard(article, 'article');
            container.appendChild(card);
        });
    }

    createCard(item, type) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col';

        const iconColor = type === 'project' ? 'bg-blue-500' : 'bg-green-500';
        const buttonText = type === 'project' ? 'Ver proyecto' : 'Leer más';

        card.innerHTML = `
            <div class="h-48 ${iconColor} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-90"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="font-serif text-xl mb-3 text-gray-900">
                    ${item.title}
                </h3>
                <p class="mb-4 text-gray-600 flex-grow text-sm leading-relaxed">
                    ${item.excerpt}
                </p>
                <button class="text-blue-600 inline-flex items-center hover:text-blue-800 font-medium mt-auto">
                    <span>${buttonText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </button>
            </div>
        `;

        return card;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando SimpleContentLoader...');
    setTimeout(() => {
        new SimpleContentLoader();
    }, 100);
});