// Sistema automático de carga de contenido desde Markdown
class ContentLoader {
    constructor() {
        this.projects = [];
        this.articles = [];
        this.currentLanguage = 'es';
        this.init();
    }

    async init() {
        // Escuchar cambios de idioma
        this.setupLanguageListener();
        
        // Cargar contenido
        await this.loadAllContent();
        
        // Renderizar contenido inicial
        this.renderAllContent();
    }

    setupLanguageListener() {
        // Observar cambios en el atributo x-data del body
        const observer = new MutationObserver(() => {
            const bodyData = document.body.getAttribute('x-data');
            if (bodyData && bodyData.includes('language')) {
                // Re-renderizar contenido cuando cambie el idioma
                setTimeout(() => this.renderAllContent(), 100);
            }
        });
        
        observer.observe(document.body, { attributes: true });
    }

    async loadAllContent() {
        try {
            await Promise.all([
                this.loadProjects(),
                this.loadArticles()
            ]);
        } catch (error) {
            console.log('Usando contenido estático por defecto');
        }
    }

    async loadProjects() {
        const projectFiles = [
            'chatbot-ela.md',
            'linguistic-reconstruction.md',
            'un-data-clustering.md',
            'remote-sensing.md'
        ];

        for (const file of projectFiles) {
            try {
                const response = await fetch(`./content/projects/${file}`);
                if (response.ok) {
                    const content = await response.text();
                    const project = this.parseMarkdown(content);
                    project.type = 'project';
                    this.projects.push(project);
                }
            } catch (error) {
                console.log(`No se pudo cargar proyecto: ${file}`);
            }
        }
    }

    async loadArticles() {
        const articleFiles = [
            'ai-epistemological-lens.md'
        ];

        for (const file of articleFiles) {
            try {
                const response = await fetch(`./content/writing/${file}`);
                if (response.ok) {
                    const content = await response.text();
                    const article = this.parseMarkdown(content);
                    article.type = 'article';
                    this.articles.push(article);
                }
            } catch (error) {
                console.log(`No se pudo cargar artículo: ${file}`);
            }
        }
    }

    parseMarkdown(content) {
        // Extraer frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = {};
        
        if (frontmatterMatch) {
            const frontmatterText = frontmatterMatch[1];
            frontmatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                    frontmatter[key] = value;
                }
            });
        }

        // Extraer contenido sin frontmatter
        const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        // Convertir Markdown básico a HTML
        let htmlContent = this.markdownToHtml(markdownContent);

        return {
            ...frontmatter,
            content: htmlContent,
            rawContent: markdownContent
        };
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-serif font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-serif font-semibold mb-3 mt-6">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg mb-4 shadow-md">')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
            .replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>')
            .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
            .split('\n\n')
            .map(paragraph => {
                if (paragraph.trim() && 
                    !paragraph.includes('<h') && 
                    !paragraph.includes('<img') && 
                    !paragraph.includes('<ul') &&
                    !paragraph.includes('<li')) {
                    return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph.trim()}</p>`;
                }
                return paragraph;
            })
            .join('\n');
    }

    renderAllContent() {
        this.renderProjects();
        this.renderArticles();
    }

    renderProjects() {
        if (this.projects.length === 0) return;

        const projectsContainer = document.querySelector('#projects .grid');
        if (!projectsContainer) return;

        // Limpiar proyectos dinámicos existentes
        const dynamicProjects = projectsContainer.querySelectorAll('[data-dynamic="true"]');
        dynamicProjects.forEach(project => project.remove());

        // Agregar nuevos proyectos
        this.projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index + 4); // +4 para los estáticos
            projectsContainer.appendChild(projectCard);
        });
    }

    renderArticles() {
        if (this.articles.length === 0) return;

        const articlesContainer = document.querySelector('#writing .grid');
        if (!articlesContainer) return;

        // Limpiar artículos dinámicos existentes
        const dynamicArticles = articlesContainer.querySelectorAll('[data-dynamic="true"]');
        dynamicArticles.forEach(article => article.remove());

        // Agregar nuevos artículos
        this.articles.forEach((article, index) => {
            const articleCard = this.createArticleCard(article, index + 3); // +3 para los estáticos
            articlesContainer.appendChild(articleCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'card group';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (150 + index * 50).toString());
        card.setAttribute('data-dynamic', 'true');

        const colorClass = this.getColorClass(project.color || 'accent');
        const iconSvg = this.getIconSvg(project.icon || 'default');

        card.innerHTML = `
            <div class="h-48 ${colorClass} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent to-accent-light opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    ${iconSvg}
                </div>
            </div>
            <div class="p-6">
                <h3 class="font-serif text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                    ${this.getLocalizedText(project.title, project.titleEn)}
                </h3>
                <p class="mb-4 text-gray-600">
                    ${this.extractExcerpt(project.content)}
                </p>
                <a href="#" class="text-accent inline-flex items-center hover:text-accent-light font-medium" onclick="showContentModal('${this.escapeHtml(project.title)}', \`${this.escapeHtml(project.content)}\`)">
                    <span>${this.currentLanguage === 'es' ? 'Ver proyecto' : 'View project'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }

    createArticleCard(article, index) {
        const card = document.createElement('div');
        card.className = 'flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md transition transform hover:-translate-y-2 hover:shadow-xl group';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (150 + index * 50).toString());
        card.setAttribute('data-dynamic', 'true');

        const colorClass = this.getColorClass(article.color || 'accent');
        const iconSvg = this.getIconSvg('article');

        card.innerHTML = `
            <div class="h-56 ${colorClass} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent to-accent-light opacity-80 group-hover:opacity-70 transition-all duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center text-white/90">
                    ${iconSvg}
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col h-64">
                <h3 class="font-serif text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                    ${this.getLocalizedText(article.title, article.titleEn)}
                </h3>
                <p class="mb-4 text-gray-600 flex-grow">
                    ${this.getLocalizedText(article.excerpt, article.excerptEn) || this.extractExcerpt(article.content)}
                </p>
                <a href="#" class="text-accent inline-flex items-center hover:text-accent-light font-medium mt-auto" onclick="showContentModal('${this.escapeHtml(article.title)}', \`${this.escapeHtml(article.content)}\`)">
                    <span>${this.currentLanguage === 'es' ? 'Leer más' : 'Read more'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }

    getLocalizedText(spanish, english) {
        return this.currentLanguage === 'es' ? spanish : (english || spanish);
    }

    getColorClass(color) {
        const colors = {
            'accent': 'bg-accent-light',
            'secondary': 'bg-secondary',
            'tertiary': 'bg-tertiary',
            'dark': 'bg-dark'
        };
        return colors[color] || 'bg-accent-light';
    }

    getIconSvg(iconType) {
        const icons = {
            'chat': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>',
            'language': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>',
            'chart': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
            'satellite': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>',
            'article': '<svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',
            'default': '<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>'
        };
        return icons[iconType] || icons['default'];
    }

    extractExcerpt(content) {
        const text = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
        return text.substring(0, 150) + '...';
    }

    escapeHtml(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }
}

// Función global para mostrar modales
function showContentModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div class="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 class="text-3xl font-serif font-bold text-gray-900">${title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <div class="prose prose-lg max-w-none">${content}</div>
            </div>
        </div>
    `;
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que Alpine.js se inicialice
    setTimeout(() => {
        new ContentLoader();
    }, 500);
});