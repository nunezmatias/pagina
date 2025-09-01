// Sistema de carga de contenido desde Markdown - VERSIÓN CORREGIDA
class ContentLoader {
    constructor() {
        console.log('ContentLoader iniciado');
        this.projects = [];
        this.articles = [];
        this.init();
    }

    async init() {
        console.log('Iniciando carga de contenido...');
        try {
            await this.loadAllContent();
            this.renderAllContent();
        } catch (error) {
            console.error('Error en init:', error);
        }
    }

    async loadAllContent() {
        try {
            await Promise.all([
                this.loadProjects(),
                this.loadArticles()
            ]);
        } catch (error) {
            console.error('Error cargando contenido:', error);
        }
    }

    async loadProjects() {
        const projectFiles = [
            'chatbot-ela-static.md',
            'linguistic-reconstruction.md', 
            'un-data-clustering.md',
            'remote-sensing.md',
            'chatbot-ela.md'
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
                console.error(`Error cargando ${file}:`, error);
            }
        }
    }

    async loadArticles() {
        const articleFiles = [
            'ai-epistemological-lens.md',
            'felix.md',
            'rivers-complex-systems.md',
            'language-cognitive-tech.md'
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
                console.error(`Error cargando ${file}:`, error);
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
                    let value = line.substring(colonIndex + 1).trim();
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    frontmatter[key] = value;
                }
            });
        }

        // Extraer contenido sin frontmatter
        const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');

        return {
            ...frontmatter,
            content: this.markdownToHtml(markdownContent),
            rawContent: markdownContent
        };
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-serif font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-serif font-semibold mb-3 mt-6">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
            .split('\n\n')
            .map(paragraph => {
                if (paragraph.trim() &&
                    !paragraph.includes('<h') &&
                    !paragraph.includes('<img') &&
                    !paragraph.includes('<ul')) {
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
        const projectsContainer = document.querySelector('#projects-container');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = '';

        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });
    }

    renderArticles() {
        const articlesContainer = document.querySelector('#writing-container');
        if (!articlesContainer) return;

        articlesContainer.innerHTML = '';

        this.articles.forEach(article => {
            const articleCard = this.createArticleCard(article);
            articlesContainer.appendChild(articleCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'card group h-full flex flex-col';

        const title = project.title || 'Título del proyecto';
        const description = this.getCleanExcerpt(project);

        card.innerHTML = `
            <div class="h-48 bg-accent-light relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent to-accent-light opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="font-serif text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                    ${title}
                </h3>
                <p class="mb-4 text-gray-600 flex-grow text-sm leading-relaxed line-clamp-4">
                    ${description}
                </p>
                <a href="#" class="text-accent inline-flex items-center hover:text-accent-light font-medium mt-auto" onclick="showContentModal('${this.escapeHtml(title)}', \`${this.escapeHtml(project.content)}\`)">
                    <span>Ver proyecto</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }

    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'card group h-full flex flex-col';

        const title = article.title || 'Título del artículo';
        const description = this.getCleanExcerpt(article);

        card.innerHTML = `
            <div class="h-48 bg-accent relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent to-accent-light opacity-80 group-hover:opacity-70 transition-all duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center text-white/90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="font-serif text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                    ${title}
                </h3>
                <p class="mb-4 text-gray-600 flex-grow text-sm leading-relaxed line-clamp-4">
                    ${description}
                </p>
                <a href="#" class="text-accent inline-flex items-center hover:text-accent-light font-medium mt-auto" onclick="showContentModal('${this.escapeHtml(title)}', \`${this.escapeHtml(article.content)}\`)">
                    <span>Leer más</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }

    getCleanExcerpt(item) {
        // Usar excerpt del frontmatter si existe
        if (item.excerpt) {
            return item.excerpt;
        }

        // Extraer texto limpio del contenido
        let text = item.rawContent
            .replace(/^---[\s\S]*?---\n/, '') // Remover frontmatter
            .replace(/^#.*$/gm, '') // Remover títulos
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold
            .replace(/\*(.*?)\*/g, '$1') // Remover italic
            .replace(/`(.*?)`/g, '$1') // Remover code
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remover links
            .replace(/^[-*+]\s+/gm, '') // Remover bullets
            .replace(/^\d+\.\s+/gm, '') // Remover números
            .replace(/\n+/g, ' ') // Convertir saltos en espacios
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();

        // Tomar las primeras palabras
        const words = text.split(' ').slice(0, 20);
        let excerpt = words.join(' ');

        if (text.split(' ').length > 20) {
            excerpt += '...';
        }

        return excerpt || 'Contenido disponible...';
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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando ContentLoader...');
    setTimeout(() => {
        new ContentLoader();
    }, 300);
});