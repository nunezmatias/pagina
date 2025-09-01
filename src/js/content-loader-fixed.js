// Sistema de carga de contenido COMPLETAMENTE NUEVO - SIN DUPLICACIONES
class SimpleContentLoader {
    constructor() {
        this.projects = [];
        this.articles = [];
        this.currentLanguage = 'es';
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
        
        // Configurar eventos de idioma
        this.setupLanguageEvents();
    }

    clearContainers() {
        const projectsContainer = document.querySelector('#projects-container');
        const articlesContainer = document.querySelector('#writing-container');
        
        if (projectsContainer) projectsContainer.innerHTML = '';
        if (articlesContainer) articlesContainer.innerHTML = '';
    }

    setupLanguageEvents() {
        // Escuchar cambios de idioma en los botones
        document.addEventListener('click', (e) => {
            // Buscar botones de idioma
            if (e.target.matches('button') && e.target.textContent.trim() === 'ES') {
                setTimeout(() => {
                    this.currentLanguage = 'es';
                    this.updateContent();
                }, 100);
            } else if (e.target.matches('button') && e.target.textContent.trim() === 'EN') {
                setTimeout(() => {
                    this.currentLanguage = 'en';
                    this.updateContent();
                }, 100);
            }
        });
    }

    updateContent() {
        // Re-renderizar contenido con el nuevo idioma
        this.clearContainers();
        this.render();
    }

    async loadContent() {
        // Cargar contenido real desde archivos MD
        await this.loadProjectsFromFiles();
        await this.loadArticlesFromFiles();
    }

    async loadProjectsFromFiles() {
        const projectFiles = [
            { file: 'chatbot-ela-static', icon: 'chat', category: 'AI' },
            { file: 'linguistic-reconstruction', icon: 'language', category: 'Linguistics' },
            { file: 'un-data-clustering', icon: 'chart', category: 'Data Science' },
            { file: 'remote-sensing', icon: 'satellite', category: 'Physics' },
            { file: 'chatbot-ela', icon: 'accessibility', category: 'AI' }
        ];

        for (const projectInfo of projectFiles) {
            try {
                // Cargar ambos idiomas
                const esResponse = await fetch(`./content/projects/${projectInfo.file}_ES.md`);
                const enResponse = await fetch(`./content/projects/${projectInfo.file}_EN.md`);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    const project = this.parseBilingualMarkdown(esContent, enContent);
                    project.type = 'project';
                    project.icon = projectInfo.icon;
                    project.category = projectInfo.category;
                    project.filename = projectInfo.file;
                    this.projects.push(project);
                } else if (esResponse.ok) {
                    // Fallback solo español
                    const content = await esResponse.text();
                    const project = this.parseMarkdown(content);
                    project.type = 'project';
                    project.icon = projectInfo.icon;
                    project.category = projectInfo.category;
                    project.filename = projectInfo.file;
                    this.projects.push(project);
                }
            } catch (error) {
                console.error(`Error cargando ${projectInfo.file}:`, error);
            }
        }
    }

    async loadArticlesFromFiles() {
        const articleFiles = [
            { file: 'ai-epistemological-lens', icon: 'brain', category: 'Philosophy' },
            { file: 'felix', icon: 'water', category: 'Adventure' },
            { file: 'rivers-complex-systems', icon: 'flow', category: 'Science' },
            { file: 'language-cognitive-tech', icon: 'mind', category: 'Technology' }
        ];

        for (const articleInfo of articleFiles) {
            try {
                // Cargar ambos idiomas
                const esResponse = await fetch(`./content/${articleInfo.file}_ES.md`);
                const enResponse = await fetch(`./content/${articleInfo.file}_EN.md`);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    const article = this.parseBilingualMarkdown(esContent, enContent);
                    article.type = 'article';
                    article.icon = articleInfo.icon;
                    article.category = articleInfo.category;
                    article.filename = articleInfo.file;
                    this.articles.push(article);
                } else if (esResponse.ok) {
                    // Fallback solo español
                    const content = await esResponse.text();
                    const article = this.parseMarkdown(content);
                    article.type = 'article';
                    article.icon = articleInfo.icon;
                    article.category = articleInfo.category;
                    article.filename = articleInfo.file;
                    this.articles.push(article);
                }
            } catch (error) {
                console.error(`Error cargando ${articleInfo.file}:`, error);
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

        // Crear traducción automática si no existe
        const translatedContent = this.createTranslation(frontmatter, markdownContent);

        return {
            ...frontmatter,
            ...translatedContent,
            content: this.markdownToHtml(markdownContent),
            rawContent: markdownContent
        };
    }

    parseBilingualMarkdown(esContent, enContent) {
        // Parsear contenido español
        const esParsed = this.parseMarkdown(esContent);
        const enParsed = this.parseMarkdown(enContent);

        return {
            title: {
                es: esParsed.title?.es || esParsed.title || 'Título',
                en: enParsed.title?.en || enParsed.title || 'Title'
            },
            excerpt: {
                es: esParsed.excerpt?.es || esParsed.excerpt || this.extractExcerpt(esContent),
                en: enParsed.excerpt?.en || enParsed.excerpt || this.extractExcerpt(enContent)
            },
            content: {
                es: esParsed.content,
                en: enParsed.content
            },
            rawContent: {
                es: esParsed.rawContent,
                en: enParsed.rawContent
            }
        };
    }

    createTranslation(frontmatter, content) {
        // Sistema de traducción automática básico
        const translations = {
            // Títulos comunes
            'Chatbot para Comunicación ELA': 'ELA Communication Chatbot',
            'Reconstrucción Lingüística con Embeddings': 'Linguistic Reconstruction with Embeddings',
            'Clustering de Datos de la ONU': 'UN Data Clustering',
            'Análisis de Teledetección': 'Remote Sensing Analysis',
            'La inteligencia artificial como lente epistemológica': 'Artificial intelligence as an epistemological lens',
            'FELIX: Navegando la incertidumbre en aguas bravas': 'FELIX: Navigating uncertainty in whitewater',
            'Ríos como sistemas complejos': 'Rivers as complex systems',
            
            // Frases comunes
            'Sistema de comunicación asistiva': 'Assistive communication system',
            'basado en IA': 'AI-based',
            'Aplicación de modelos': 'Application of models',
            'Técnicas de reducción': 'Reduction techniques',
            'Análisis basado en física': 'Physics-based analysis',
            'Reflexiones sobre': 'Reflections on',
            'Notas de campo': 'Field notes'
        };

        const result = {
            title: {
                es: frontmatter.title || 'Título',
                en: frontmatter.titleEn || translations[frontmatter.title] || frontmatter.title || 'Title'
            },
            excerpt: {
                es: frontmatter.excerpt || this.extractExcerpt(content),
                en: frontmatter.excerptEn || this.translateText(frontmatter.excerpt || this.extractExcerpt(content), translations)
            }
        };

        return result;
    }

    translateText(text, translations) {
        if (!text) return text;
        
        let translated = text;
        for (const [spanish, english] of Object.entries(translations)) {
            translated = translated.replace(new RegExp(spanish, 'gi'), english);
        }
        return translated;
    }

    extractExcerpt(content) {
        // Extraer primer párrafo significativo
        const lines = content.split('\n').filter(line => line.trim());
        for (const line of lines) {
            if (line.length > 50 && !line.startsWith('#') && !line.startsWith('*')) {
                return line.substring(0, 150) + (line.length > 150 ? '...' : '');
            }
        }
        return 'Contenido disponible...';
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-serif font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-serif font-semibold mb-3 mt-6">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-4">')
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

        // Obtener contenido en el idioma actual
        const title = item.title[this.currentLanguage] || item.title.es;
        const excerpt = item.excerpt[this.currentLanguage] || item.excerpt.es;

        // Obtener icono específico según el contenido
        const icon = this.getIconForContent(item.icon || 'default');
        const bgColor = type === 'project' ? 'bg-accent-light' : 'bg-accent';
        const gradientFrom = type === 'project' ? 'from-accent' : 'from-accent';
        const gradientTo = type === 'project' ? 'to-accent-light' : 'to-accent-light';
        
        const buttonText = type === 'project' 
            ? (this.currentLanguage === 'es' ? 'Ver proyecto' : 'View project')
            : (this.currentLanguage === 'es' ? 'Leer más' : 'Read more');

        card.innerHTML = `
            <div class="h-48 ${bgColor} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    ${icon}
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="font-serif text-xl mb-3 text-gray-900 group-hover:text-accent transition-colors duration-300">
                    ${title}
                </h3>
                <p class="mb-4 text-gray-600 flex-grow text-sm leading-relaxed">
                    ${excerpt}
                </p>
                <button class="text-accent inline-flex items-center hover:text-accent-light font-medium mt-auto" onclick="openFullContent('${item.filename}', '${type}', contentLoader.currentLanguage)">
                    <span>${buttonText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </button>
            </div>
        `;

        return card;
    }

    getIconForContent(iconType) {
        const icons = {
            'chat': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>`,
            
            'language': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>`,
            
            'chart': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>`,
            
            'satellite': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>`,
            
            'accessibility': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>`,
            
            'brain': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>`,
            
            'water': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
            </svg>`,
            
            'flow': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>`,
            
            'mind': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>`,
            
            'default': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>`
        };

        return icons[iconType] || icons['default'];
    }

    escapeHtml(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }
}

// Función global para abrir contenido completo en página nueva
async function openFullContent(filename, type, language) {
    try {
        // Determinar la ruta correcta según el tipo
        const folder = type === 'project' ? 'projects' : '';
        const languageSuffix = language.toUpperCase();
        
        let filePath;
        if (type === 'project') {
            filePath = `./content/${folder}/${filename}_${languageSuffix}.md`;
        } else {
            filePath = `./content/${filename}_${languageSuffix}.md`;
        }
        
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Error loading ${filePath}`);
        }
        
        const content = await response.text();
        
        // Parsear el markdown
        const parsedContent = parseFullMarkdown(content, language);
        
        // Crear página completa
        createFullContentPage(parsedContent, language);
        
    } catch (error) {
        console.error('Error loading full content:', error);
        // Fallback a modal si hay error
        showContentModal('Error', 'No se pudo cargar el contenido completo.');
    }
}

// Función para parsear markdown completo con traducción
function parseFullMarkdown(content, language) {
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
    let markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Traducir contenido si el idioma es inglés
    if (language === 'en') {
        markdownContent = translateMarkdownContent(markdownContent);
    }
    
    // Convertir markdown a HTML con soporte completo
    const htmlContent = markdownToFullHtml(markdownContent);
    
    // Obtener título según idioma
    let title;
    if (language === 'en') {
        title = frontmatter.titleEn || frontmatter.title || 'Content';
    } else {
        title = frontmatter.title || 'Contenido';
    }
    
    return {
        title,
        content: htmlContent,
        frontmatter
    };
}

// Función mejorada para convertir markdown a HTML
function markdownToFullHtml(markdown) {
    return markdown
        // Títulos
        .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-serif font-bold mb-6 mt-8 text-gray-900">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-serif font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4 class="text-xl font-semibold mb-2 mt-4 text-gray-700">$1</h4>')
        
        // Texto en negrita e itálica
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
        
        // Código inline
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
        
        // Imágenes con mejor styling
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-8"><img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-lg"><p class="text-sm text-gray-600 text-center mt-2 italic">$1</p></div>')
        
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent hover:text-accent-light underline" target="_blank">$1</a>')
        
        // Listas
        .replace(/^[-*+] (.*$)/gm, '<li class="mb-2 text-gray-700">$1</li>')
        
        // Dividir en párrafos y procesar
        .split('\n\n')
        .map(paragraph => {
            const trimmed = paragraph.trim();
            if (!trimmed) return '';
            
            // Si ya es HTML (contiene tags), devolverlo tal como está
            if (trimmed.includes('<h') || trimmed.includes('<img') || 
                trimmed.includes('<div') || trimmed.includes('<li')) {
                return trimmed;
            }
            
            // Si contiene elementos de lista, envolverlos en ul
            if (trimmed.includes('<li')) {
                return `<ul class="list-disc list-inside mb-6 space-y-2">${trimmed}</ul>`;
            }
            
            // Párrafo normal
            return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${trimmed}</p>`;
        })
        .join('\n');
}

// Función para crear página completa
function createFullContentPage(parsedContent, language) {
    // Crear overlay de página completa
    const fullPage = document.createElement('div');
    fullPage.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
    
    const backText = language === 'es' ? 'Volver' : 'Back';
    
    fullPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <!-- Header Navigation Complete -->
            <header class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav class="flex justify-between items-center py-4">
                        <!-- Logo/Name -->
                        <a href="#" onclick="this.closest('.fixed').remove()" class="font-serif text-xl sm:text-2xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Matias Núñez
                        </a>
                        
                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center gap-6">
                            <div class="flex gap-6">
                                <button onclick="closePageAndGoTo('#about')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${language === 'es' ? 'Sobre Mí' : 'About Me'}
                                </button>
                                <button onclick="closePageAndGoTo('#projects')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${language === 'es' ? 'Proyectos' : 'Projects'}
                                </button>
                                <button onclick="closePageAndGoTo('#writing')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${language === 'es' ? 'Escritos' : 'Writing'}
                                </button>
                                <button onclick="closePageAndGoTo('#contact')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${language === 'es' ? 'Contacto' : 'Contact'}
                                </button>
                            </div>
                            
                            <!-- Language Selector -->
                            <div class="flex items-center gap-2 border border-gray-200 rounded-full p-1">
                                <button onclick="changeContentLanguage('es')" class="${language === 'es' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    ES
                                </button>
                                <button onclick="changeContentLanguage('en')" class="${language === 'en' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    EN
                                </button>
                            </div>
                            
                            <!-- Back Button -->
                            <button onclick="this.closest('.fixed').remove()" class="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                ${backText}
                            </button>
                        </div>
                        
                        <!-- Mobile Back Button -->
                        <button onclick="this.closest('.fixed').remove()" class="md:hidden inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            ${backText}
                        </button>
                    </nav>
                </div>
            </header>
            
            <!-- Content -->
            <article class="max-w-4xl mx-auto px-6 py-12">
                <header class="mb-12 text-center">
                    <h1 class="text-5xl font-serif font-bold text-gray-900 mb-4">${parsedContent.title}</h1>
                    <div class="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                </header>
                
                <div class="prose prose-lg prose-gray max-w-none">
                    ${parsedContent.content}
                </div>
                
                <!-- Footer -->
                <footer class="mt-16 pt-8 border-t border-gray-200 text-center">
                    <button onclick="this.closest('.fixed').remove()" class="btn btn-primary">
                        ${backText}
                    </button>
                </footer>
            </article>
        </div>
    `;
    
    // Agregar estilos de botón si no existen
    if (!document.querySelector('#full-content-styles')) {
        const styles = document.createElement('style');
        styles.id = 'full-content-styles';
        styles.textContent = `
            .btn {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                font-weight: 600;
                border-radius: 0.375rem;
                transition: all 0.3s ease-in-out;
                text-decoration: none;
                border: none;
                cursor: pointer;
            }
            .btn-primary {
                background: linear-gradient(to right, #1a5a7a, #3a8bb2);
                color: white;
            }
            .btn-primary:hover {
                box-shadow: 0 10px 15px -3px rgba(26, 90, 122, 0.3);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(fullPage);
    
    // Scroll al top
    fullPage.scrollTop = 0;
}

// Función de fallback para modal pequeño
function showContentModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <div class="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 class="text-2xl font-serif font-bold text-gray-900">${title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <div class="prose max-w-none">${content}</div>
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

// Variable global para el loader
let contentLoader;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando SimpleContentLoader...');
    setTimeout(() => {
        contentLoader = new SimpleContentLoader();
    }, 100);
});

// Functions for full page navigation
function closePageAndGoTo(targetId) {
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage) {
        fullPage.remove();
    }
    
    setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

function changeContentLanguage(newLanguage) {
    if (contentLoader) {
        contentLoader.currentLanguage = newLanguage;
    }
    
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    const currentTitle = fullPage?.querySelector('h1')?.textContent;
    
    if (fullPage && currentTitle && contentLoader) {
        let targetItem = null;
        let type = '';
        
        for (const project of contentLoader.projects) {
            if (project.title.es === currentTitle || project.title.en === currentTitle) {
                targetItem = project;
                type = 'project';
                break;
            }
        }
        
        if (!targetItem) {
            for (const article of contentLoader.articles) {
                if (article.title.es === currentTitle || article.title.en === currentTitle) {
                    targetItem = article;
                    type = 'article';
                    break;
                }
            }
        }
        
        if (targetItem && type) {
            fullPage.remove();
            setTimeout(() => {
                openFullContent(targetItem.filename, type, newLanguage);
            }, 50);
        }
    }
}

// Function to translate markdown content to English
function translateMarkdownContent(markdownContent) {
    const translations = {
        // Common headings
        'Descripción del Proyecto': 'Project Description',
        'Fundamentos Físicos': 'Physical Foundations',
        'Metodologías Desarrolladas': 'Developed Methodologies',
        'Tecnologías y Plataformas': 'Technologies and Platforms',
        'Aplicaciones Desarrolladas': 'Developed Applications',
        'Resultados e Impacto': 'Results and Impact',
        'El momento de la decisión': 'The moment of decision',
        'La física del caos': 'The physics of chaos',
        'Reflexiones finales': 'Final reflections',
        
        // Common phrases
        'Sistema de comunicación asistiva basado en IA': 'AI-based assistive communication system',
        'para personas con ELA': 'for people with ALS',
        'integrando reconocimiento de gestos mínimos': 'integrating minimal gesture recognition',
        'y generación de lenguaje natural': 'and natural language generation',
        'Aplicación de modelos de embeddings': 'Application of embedding models',
        'para la reconstrucción y análisis': 'for reconstruction and analysis',
        'de corpus lingüísticos históricos': 'of historical linguistic corpora',
        'como el inglés antiguo': 'such as Old English',
        'Técnicas de reducción de dimensionalidad': 'Dimensionality reduction techniques',
        'y clustering aplicadas a datos': 'and clustering applied to data',
        'de Naciones Unidas': 'from the United Nations',
        'para identificar patrones': 'to identify patterns',
        'en indicadores de desarrollo sostenible': 'in sustainable development indicators',
        'Análisis basado en física': 'Physics-based analysis',
        'para interpretación de datos de teledetección': 'for remote sensing data interpretation',
        'con aplicaciones en monitoreo ambiental': 'with applications in environmental monitoring',
        'y gestión de recursos naturales': 'and natural resource management',
        'Reflexiones sobre cómo los modelos de IA': 'Reflections on how AI models',
        'nos ayudan a entender no solo el mundo': 'help us understand not only the world',
        'sino también nuestros propios procesos': 'but also our own processes',
        'de conocimiento': 'of knowledge',
        'Reflexiones desde el río': 'Reflections from the river',
        'sobre la toma de decisiones': 'on decision-making',
        'bajo incertidumbre extrema': 'under extreme uncertainty',
        'y las lecciones que los rápidos': 'and the lessons that rapids',
        'de clase V nos enseñan': 'Class V teach us',
        'sobre la vida': 'about life',
        'Notas de campo sobre la dinámica': 'Field notes on the dynamics',
        'de fluidos en ríos': 'of fluids in rivers',
        'y sus paralelos con sistemas': 'and their parallels with systems',
        'adaptativos complejos': 'complex adaptive',
        
        // Additional headings
        'Radiación Electromagnética': 'Electromagnetic Radiation',
        'Corrección Atmosférica': 'Atmospheric Correction',
        'Sensores Satelitales': 'Satellite Sensors',
        'Monitoreo de Deforestación': 'Deforestation Monitoring',
        'Agricultura de Precisión': 'Precision Agriculture',
        
        // More phrases
        'Espectro visible': 'Visible spectrum',
        'vegetación y cuerpos de agua': 'vegetation and water bodies',
        'Infrarrojo cercano': 'Near infrared',
        'Biomasa y humedad del suelo': 'Biomass and soil moisture',
        'Infrarrojo térmico': 'Thermal infrared',
        'temperatura superficial': 'surface temperature',
        'Absorción selectiva': 'Selective absorption',
        'por diferentes materiales': 'by different materials',
        'Dispersión de Rayleigh': 'Rayleigh scattering',
        'en la atmósfera': 'in the atmosphere',
        'Dispersión de Mie': 'Mie scattering',
        'por aerosoles y nubes': 'by aerosols and clouds',
        'Resolución temporal': 'Temporal resolution',
        'Resolución espacial': 'Spatial resolution',
        'Cobertura global diaria': 'Daily global coverage',
        'Procesamiento en la nube': 'Cloud processing',
        'Detección automática': 'Automatic detection',
        'Precisión general': 'Overall accuracy',
        'Tiempo de procesamiento': 'Processing time',
        'Monitoreo forestal': 'Forest monitoring',
        'Sistema de alerta': 'Alert system',
        
        // Common words
        'desarrollo': 'development',
        'algoritmos': 'algorithms',
        'avanzados': 'advanced',
        'procesamiento': 'processing',
        'interpretación': 'interpretation',
        'información': 'information',
        'precisa': 'precise',
        'procesos': 'processes',
        'ambientales': 'environmental',
        'vegetación': 'vegetation',
        'temperatura': 'temperature',
        'diferentes': 'different',
        'materiales': 'materials',
        'aplicaciones': 'applications',
        'monitoreo': 'monitoring',
        'gestión': 'management',
        'recursos': 'resources',
        'naturales': 'natural',
        'detección': 'detection',
        'análisis': 'analysis',
        'datos': 'data',
        'satelitales': 'satellite',
        'principios': 'principles',
        'fundamentales': 'fundamental',
        'extraer': 'extract',
        'atmosférica': 'atmospheric',
        'humedad': 'humidity',
        'superficial': 'surface',
        'usando': 'using',
        'mediante': 'through',
        'basado': 'based',
        'aplicado': 'applied',
        'utilizado': 'used',
        'para': 'for',
        'con': 'with',
        'por': 'by',
        'sobre': 'about',
        'desde': 'from',
        'hasta': 'to',
        'entre': 'between',
        'durante': 'during',
        'después': 'after',
        'antes': 'before'
    };
    
    let translatedContent = markdownContent;
    
    for (const [spanish, english] of Object.entries(translations)) {
        const regex = new RegExp(spanish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        translatedContent = translatedContent.replace(regex, english);
    }
    
    return translatedContent;
}/
/ Function to format paragraphs with uniform length and proper indentation
function formatParagraphs(htmlContent) {
    // Enhanced paragraph formatting with better typography
    return htmlContent.replace(/<p class="mb-4 text-gray-700 leading-relaxed">(.*?)<\/p>/g, (match, content) => {
        // Clean the content and split into sentences
        const sentences = content.split(/(?<=[.!?])\s+/);
        let formattedContent = '';
        let currentLine = '';
        const maxLineLength = 80; // Characters per line
        
        sentences.forEach(sentence => {
            if ((currentLine + sentence).length > maxLineLength && currentLine.length > 0) {
                formattedContent += currentLine.trim() + '<br>';
                currentLine = '&nbsp;&nbsp;&nbsp;&nbsp;' + sentence + ' ';
            } else {
                currentLine += sentence + ' ';
            }
        });
        
        if (currentLine.trim()) {
            formattedContent += currentLine.trim();
        }
        
        return `<p class="mb-6 text-gray-700 leading-relaxed text-lg text-justify" style="text-indent: 1.5em; line-height: 1.8; hyphens: auto;">${formattedContent}</p>`;
    });
}