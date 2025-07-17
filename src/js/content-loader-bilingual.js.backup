// Sistema de carga de contenido BILINGÜE - Archivos separados ES/EN
class BilingualContentLoader {
    constructor() {
        this.projects = [];
        this.articles = [];
        this.currentLanguage = 'es';
        this.init();
    }

    async init() {
        console.log('Iniciando carga bilingüe...');
        
        this.clearContainers();
        await this.loadContent();
        this.render();
        this.setupLanguageEvents();
    }

    clearContainers() {
        const projectsContainer = document.querySelector('#projects-container');
        const articlesContainer = document.querySelector('#writing-container');
        
        if (projectsContainer) projectsContainer.innerHTML = '';
        if (articlesContainer) articlesContainer.innerHTML = '';
    }

    setupLanguageEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button') && e.target.textContent.trim() === 'ES') {
                this.currentLanguage = 'es';
                this.updateContent();
            } else if (e.target.matches('button') && e.target.textContent.trim() === 'EN') {
                this.currentLanguage = 'en';
                this.updateContent();
            }
        });
    }

    updateContent() {
        this.clearContainers();
        this.render();
    }

    async loadContent() {
        await this.loadProjectsFromFiles();
        await this.loadArticlesFromFiles();
    }

    async loadProjectsFromFiles() {
        // Auto-detect all available bilingual projects
        const availableProjects = await this.detectBilingualFiles('./content/projects/');
        
        // Icon and category mapping for known projects
        const projectConfig = {
            'remote-sensing': { icon: 'satellite', category: 'Physics' },
            'chatbot-ela-static': { icon: 'chat', category: 'AI' },
            'chatbot-ela': { icon: 'chat', category: 'AI' },
            'linguistic-reconstruction': { icon: 'language', category: 'Linguistics' },
            'un-data-clustering': { icon: 'chart', category: 'Data Science' },
            'felix': { icon: 'water', category: 'Adventure' },
            'ai-epistemological-lens': { icon: 'brain', category: 'Philosophy' },
            'language-cognitive-tech': { icon: 'brain', category: 'Technology' },
            'rivers-complex-systems': { icon: 'water', category: 'Science' }
        };

        for (const baseFilename of availableProjects) {
            try {
                // Cargar ambas versiones (ES y EN)
                const esResponse = await fetch(`./content/projects/${baseFilename}_ES.md`);
                const enResponse = await fetch(`./content/projects/${baseFilename}_EN.md`);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    const config = projectConfig[baseFilename] || { icon: 'default', category: 'General' };
                    
                    const project = {
                        es: this.parseMarkdown(esContent),
                        en: this.parseMarkdown(enContent),
                        type: 'project',
                        icon: config.icon,
                        category: config.category,
                        baseFilename: baseFilename
                    };
                    
                    this.projects.push(project);
                }
            } catch (error) {
                console.error(`Error cargando ${baseFilename}:`, error);
            }
        }
    }

    async loadArticlesFromFiles() {
        // Auto-detect all available bilingual articles
        const availableArticles = await this.detectBilingualFiles('./content/writing/');
        
        // Icon and category mapping for known articles
        const articleConfig = {
            'felix': { icon: 'water', category: 'Adventure' },
            'ai-epistemological-lens': { icon: 'brain', category: 'Philosophy' },
            'language-cognitive-tech': { icon: 'brain', category: 'Technology' },
            'rivers-complex-systems': { icon: 'water', category: 'Science' }
        };

        for (const baseFilename of availableArticles) {
            try {
                // Intentar cargar ambas versiones
                const esResponse = await fetch(`./content/writing/${baseFilename}_ES.md`);
                const enResponse = await fetch(`./content/writing/${baseFilename}_EN.md`);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    const config = articleConfig[baseFilename] || { icon: 'default', category: 'General' };
                    
                    const article = {
                        es: this.parseMarkdown(esContent),
                        en: this.parseMarkdown(enContent),
                        type: 'article',
                        icon: config.icon,
                        category: config.category,
                        baseFilename: baseFilename
                    };
                    
                    this.articles.push(article);
                }
            } catch (error) {
                console.error(`Error cargando ${baseFilename}:`, error);
            }
        }
    }

    async detectBilingualFiles(folderPath) {
        console.log(`🔍 Scanning for bilingual files in: ${folderPath}`);
        
        // Method 1: Try to fetch the generated directory listing (most efficient)
        try {
            const directoryListResponse = await fetch(`${folderPath}directory-listing.json`);
            if (directoryListResponse.ok) {
                const directoryData = await directoryListResponse.json();
                const bilingualFiles = directoryData.bilingualFiles || [];
                
                console.log(`📁 Found ${bilingualFiles.length} bilingual files via directory listing:`);
                bilingualFiles.forEach(file => {
                    console.log(`   ✅ ${file} (ES & EN)`);
                });
                
                return bilingualFiles;
            }
        } catch (error) {
            console.log(`⚠️  Directory listing not available for ${folderPath}, using fallback discovery`);
        }

        // Method 2: Fallback - Known files as a reliable starting point
        const knownFiles = {
            './content/projects/': [
                'remote-sensing', 'chatbot-ela-static', 'chatbot-ela', 
                'linguistic-reconstruction', 'un-data-clustering'
            ],
            './content/writing/': [
                'felix', 'ai-epistemological-lens', 
                'language-cognitive-tech', 'rivers-complex-systems'
            ]
        };
        
        const discoveredFiles = new Set();
        const known = knownFiles[folderPath] || [];
        
        // Verify known files still exist
        for (const basename of known) {
            try {
                const [esResponse, enResponse] = await Promise.all([
                    fetch(`${folderPath}${basename}_ES.md`),
                    fetch(`${folderPath}${basename}_EN.md`)
                ]);
                
                if (esResponse.ok && enResponse.ok) {
                    discoveredFiles.add(basename);
                    console.log(`✅ Verified bilingual content: ${basename}`);
                } else {
                    console.log(`⚠️  Missing files for: ${basename}`);
                }
            } catch (error) {
                console.log(`❌ Error checking: ${basename}`);
            }
        }
        
        console.log(`📊 Total verified files in ${folderPath}: ${discoveredFiles.size}`);
        return Array.from(discoveredFiles);
    }

    extractBilingualBasenames(fileList) {
        const basenames = new Set();
        
        fileList.forEach(filename => {
            if (filename.endsWith('_ES.md')) {
                const basename = filename.replace('_ES.md', '');
                // Check if corresponding EN file exists
                if (fileList.includes(`${basename}_EN.md`)) {
                    basenames.add(basename);
                }
            }
        });
        
        return Array.from(basenames);
    }

    parseMarkdown(content) {
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

        const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');

        return {
            ...frontmatter,
            content: this.markdownToHtml(markdownContent),
            rawContent: markdownContent
        };
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-serif font-bold mb-6 mt-8 text-gray-900">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-serif font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
            .replace(/^[-*+] (.*$)/gm, '<li class="mb-2 text-gray-700 ml-4">$1</li>')
            .split('\n\n')
            .map(paragraph => {
                const trimmed = paragraph.trim();
                if (!trimmed) return '';
                
                if (trimmed.includes('<h') || trimmed.includes('<li')) {
                    return trimmed.includes('<li') ? 
                        `<ul class="list-disc list-inside mb-6 space-y-2">${trimmed}</ul>` : 
                        trimmed;
                }
                
                return `<p class="mb-6 text-gray-700 leading-relaxed text-lg text-justify" style="text-indent: 1.5em; line-height: 1.8;">${trimmed}</p>`;
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
        const currentContent = item[this.currentLanguage];
        const title = currentContent.title || 'Título';
        const excerpt = currentContent.excerpt || this.extractExcerpt(currentContent.rawContent);

        const icon = this.getIconForContent(item.icon || 'default');
        const bgColor = type === 'project' ? 'bg-accent-light' : 'bg-accent';
        const buttonText = type === 'project' 
            ? (this.currentLanguage === 'es' ? 'Ver proyecto' : 'View project')
            : (this.currentLanguage === 'es' ? 'Leer más' : 'Read more');

        card.innerHTML = `
            <div class="h-48 ${bgColor} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent to-accent-light opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
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
                <button class="text-accent inline-flex items-center hover:text-accent-light font-medium mt-auto" onclick="openBilingualContent('${item.baseFilename}', '${type}', bilingualLoader.currentLanguage)">
                    <span>${buttonText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </button>
            </div>
        `;

        return card;
    }

    extractExcerpt(content) {
        const lines = content.split('\n').filter(line => line.trim());
        for (const line of lines) {
            if (line.length > 50 && !line.startsWith('#') && !line.startsWith('*')) {
                return line.substring(0, 150) + (line.length > 150 ? '...' : '');
            }
        }
        return 'Contenido disponible...';
    }

    getIconForContent(iconType) {
        const icons = {
            'satellite': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>`,
            'chat': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>`,
            'language': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>`,
            'chart': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>`,
            'water': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
            </svg>`,
            'brain': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>`,
            'default': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>`
        };

        return icons[iconType] || icons['default'];
    }
}

// Variable global para el loader bilingüe
let bilingualLoader;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando BilingualContentLoader...');
    setTimeout(() => {
        bilingualLoader = new BilingualContentLoader();
    }, 100);
});

// Función para abrir contenido bilingüe
async function openBilingualContent(baseFilename, type, language) {
    try {
        const folder = type === 'project' ? 'projects' : 'writing';
        const suffix = language === 'es' ? '_ES' : '_EN';
        const filename = `${baseFilename}${suffix}.md`;
        
        const response = await fetch(`./content/${folder}/${filename}`);
        
        if (!response.ok) {
            throw new Error(`Error loading ${filename}`);
        }
        
        const content = await response.text();
        const parsedContent = parseBilingualMarkdown(content);
        
        createBilingualContentPage(parsedContent, language, baseFilename, type);
        
    } catch (error) {
        console.error('Error loading bilingual content:', error);
        alert('Error cargando contenido');
    }
}

function parseBilingualMarkdown(content) {
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

    const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Convertir markdown a HTML con formateo mejorado
    const htmlContent = markdownContent
        .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-serif font-bold mb-6 mt-8 text-gray-900">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-serif font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
        .replace(/^[-*+] (.*$)/gm, '<li class="mb-2 text-gray-700 ml-4">$1</li>')
        .split('\n\n')
        .map(paragraph => {
            const trimmed = paragraph.trim();
            if (!trimmed) return '';
            
            if (trimmed.includes('<h') || trimmed.includes('<li')) {
                return trimmed.includes('<li') ? 
                    `<ul class="list-disc list-inside mb-6 space-y-2">${trimmed}</ul>` : 
                    trimmed;
            }
            
            return `<p class="mb-6 text-gray-700 leading-relaxed text-lg text-justify" style="text-indent: 1.5em; line-height: 1.8; hyphens: auto;">${trimmed}</p>`;
        })
        .join('\n');

    return {
        title: frontmatter.title || 'Contenido',
        content: htmlContent,
        frontmatter
    };
}

function createBilingualContentPage(parsedContent, language, baseFilename, type) {
    const fullPage = document.createElement('div');
    fullPage.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
    
    const backText = language === 'es' ? 'Volver' : 'Back';
    const aboutText = language === 'es' ? 'Sobre Mí' : 'About Me';
    const projectsText = language === 'es' ? 'Proyectos' : 'Projects';
    const writingText = language === 'es' ? 'Escritos' : 'Writing';
    const contactText = language === 'es' ? 'Contacto' : 'Contact';
    
    fullPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <header class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav class="flex justify-between items-center py-4">
                        <a href="#" onclick="this.closest('.fixed').remove()" class="font-serif text-xl sm:text-2xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Matias Núñez
                        </a>
                        
                        <div class="hidden md:flex items-center gap-6">
                            <div class="flex gap-6">
                                <button onclick="closeBilingualPageAndGoTo('#about')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${aboutText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#projects')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${projectsText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#writing')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${writingText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#contact')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${contactText}
                                </button>
                            </div>
                            
                            <div class="flex items-center gap-2 border border-gray-200 rounded-full p-1">
                                <button onclick="changeBilingualLanguage('es', '${baseFilename}', '${type}')" class="${language === 'es' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    ES
                                </button>
                                <button onclick="changeBilingualLanguage('en', '${baseFilename}', '${type}')" class="${language === 'en' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    EN
                                </button>
                            </div>
                            
                            <button onclick="this.closest('.fixed').remove()" class="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                ${backText}
                            </button>
                        </div>
                        
                        <button onclick="this.closest('.fixed').remove()" class="md:hidden inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            ${backText}
                        </button>
                    </nav>
                </div>
            </header>
            
            <article class="max-w-4xl mx-auto px-6 py-12">
                <header class="mb-12 text-center">
                    <h1 class="text-5xl font-serif font-bold text-gray-900 mb-4">${parsedContent.title}</h1>
                    <div class="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                </header>
                
                <div class="prose prose-lg prose-gray max-w-none">
                    ${parsedContent.content}
                </div>
                
                <footer class="mt-16 pt-8 border-t border-gray-200 text-center">
                    <button onclick="this.closest('.fixed').remove()" class="btn btn-primary">
                        ${backText}
                    </button>
                </footer>
            </article>
        </div>
    `;
    
    document.body.appendChild(fullPage);
    fullPage.scrollTop = 0;
}

function closeBilingualPageAndGoTo(targetId) {
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage) fullPage.remove();
    
    setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }, 100);
}

function changeBilingualLanguage(newLanguage, baseFilename, type) {
    // Update the global language setting
    if (bilingualLoader) {
        bilingualLoader.currentLanguage = newLanguage;
    }
    
    // Check if we're currently viewing a content page
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage) {
        // We're in a content page, so smoothly transition to the new language
        const article = fullPage.querySelector('article');
        if (article) {
            // Add a smooth transition effect
            article.style.opacity = '0.5';
            article.style.transition = 'opacity 0.3s ease';
        }
        
        // Load the new language content and replace the current page
        setTimeout(async () => {
            try {
                const folder = type === 'project' ? 'projects' : 'writing';
                const suffix = newLanguage === 'es' ? '_ES' : '_EN';
                const filename = `${baseFilename}${suffix}.md`;
                
                const response = await fetch(`./content/${folder}/${filename}`);
                if (!response.ok) {
                    throw new Error(`Error loading ${filename}`);
                }
                
                const content = await response.text();
                const parsedContent = parseBilingualMarkdown(content);
                
                // Remove the old page and create the new one
                fullPage.remove();
                createBilingualContentPage(parsedContent, newLanguage, baseFilename, type);
                
            } catch (error) {
                console.error('Error switching language:', error);
                // Fallback: remove page and show alert
                fullPage.remove();
                alert('Error cambiando idioma / Error switching language');
            }
        }, 150);
    } else {
        // We're on the main page, just update the content
        bilingualLoader.updateContent();
    }
}
//
 Función específica para abrir el CV
async function openCV(language) {
    try {
        const suffix = language === 'es' ? '_ES' : '_EN';
        const filename = `cv${suffix}.md`;
        
        const response = await fetch(`./content/${filename}`);
        
        if (!response.ok) {
            throw new Error(`Error loading ${filename}`);
        }
        
        const content = await response.text();
        const parsedContent = parseBilingualMarkdown(content);
        
        createCVPage(parsedContent, language);
        
    } catch (error) {
        console.error('Error loading CV:', error);
        alert('Error cargando CV / Error loading CV');
    }
}

// Función para crear la página del CV
function createCVPage(parsedContent, language) {
    const fullPage = document.createElement('div');
    fullPage.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
    
    const backText = language === 'es' ? 'Volver' : 'Back';
    const aboutText = language === 'es' ? 'Sobre Mí' : 'About Me';
    const projectsText = language === 'es' ? 'Proyectos' : 'Projects';
    const writingText = language === 'es' ? 'Escritos' : 'Writing';
    const contactText = language === 'es' ? 'Contacto' : 'Contact';
    
    fullPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <header class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav class="flex justify-between items-center py-4">
                        <a href="#" onclick="this.closest('.fixed').remove()" class="font-serif text-xl sm:text-2xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Matias Núñez
                        </a>
                        
                        <div class="hidden md:flex items-center gap-6">
                            <div class="flex gap-6">
                                <button onclick="closeBilingualPageAndGoTo('#about')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${aboutText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#projects')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${projectsText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#writing')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${writingText}
                                </button>
                                <button onclick="closeBilingualPageAndGoTo('#contact')" class="font-medium hover:text-accent transition-colors text-gray-700">
                                    ${contactText}
                                </button>
                            </div>
                            
                            <div class="flex items-center gap-2 border border-gray-200 rounded-full p-1">
                                <button onclick="changeCVLanguage('es')" class="${language === 'es' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    ES
                                </button>
                                <button onclick="changeCVLanguage('en')" class="${language === 'en' ? 'bg-accent text-white' : 'hover:bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300 text-sm font-medium">
                                    EN
                                </button>
                            </div>
                            
                            <button onclick="this.closest('.fixed').remove()" class="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                ${backText}
                            </button>
                        </div>
                        
                        <button onclick="this.closest('.fixed').remove()" class="md:hidden inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            ${backText}
                        </button>
                    </nav>
                </div>
            </header>
            
            <article class="max-w-4xl mx-auto px-6 py-12">
                <div class="prose prose-lg prose-gray max-w-none cv-content">
                    ${parsedContent.content}
                </div>
                
                <footer class="mt-16 pt-8 border-t border-gray-200 text-center">
                    <button onclick="this.closest('.fixed').remove()" class="btn btn-primary">
                        ${backText}
                    </button>
                </footer>
            </article>
        </div>
    `;
    
    document.body.appendChild(fullPage);
    fullPage.scrollTop = 0;
}

// Función para cambiar idioma del CV
function changeCVLanguage(newLanguage) {
    // Update the global language setting
    if (bilingualLoader) {
        bilingualLoader.currentLanguage = newLanguage;
    }
    
    // Check if we're currently viewing the CV page
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage && fullPage.querySelector('.cv-content')) {
        // We're in the CV page, so smoothly transition to the new language
        const article = fullPage.querySelector('article');
        if (article) {
            // Add a smooth transition effect
            article.style.opacity = '0.5';
            article.style.transition = 'opacity 0.3s ease';
        }
        
        // Load the new language CV and replace the current page
        setTimeout(async () => {
            try {
                const suffix = newLanguage === 'es' ? '_ES' : '_EN';
                const filename = `cv${suffix}.md`;
                
                const response = await fetch(`./content/${filename}`);
                if (!response.ok) {
                    throw new Error(`Error loading ${filename}`);
                }
                
                const content = await response.text();
                const parsedContent = parseBilingualMarkdown(content);
                
                // Remove the old page and create the new one
                fullPage.remove();
                createCVPage(parsedContent, newLanguage);
                
            } catch (error) {
                console.error('Error switching CV language:', error);
                // Fallback: remove page and show alert
                fullPage.remove();
                alert('Error cambiando idioma del CV / Error switching CV language');
            }
        }, 150);
    }
}