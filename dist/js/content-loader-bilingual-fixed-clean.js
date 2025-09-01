// Sistema de carga de contenido BILINGUE - Version limpia y funcional
class BilingualContentLoader {
    constructor() {
        this.projects = [];
        this.articles = [];
        this.currentLanguage = 'es';
        this.basePath = this.detectBasePath();
        this.init();
    }

    // Detectar automáticamente si estamos en GitHub Pages o local
    detectBasePath() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        // Si estamos en GitHub Pages
        if (hostname.includes('github.io')) {
            // Extraer el nombre del repositorio del pathname
            const pathParts = pathname.split('/').filter(part => part);
            if (pathParts.length > 0) {
                return `/${pathParts[0]}`;
            }
        }
        
        // Para desarrollo local o servidor personalizado
        return '';
    }

    // Construir URL completa basada en el entorno
    buildContentUrl(relativePath) {
        // Remover ./ del inicio si existe
        const cleanPath = relativePath.replace(/^\.\//, '');
        return `${this.basePath}/${cleanPath}`;
    }

    async init() {
        console.log('Iniciando carga bilingue...');
        
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
        // 🚀 AUTO-DISCOVERY: Usar API de GitHub para encontrar archivos automáticamente
        const availableProjects = await this.autoDiscoverProjects();
        
        // Configuración híbrida: auto-detectar + casos especiales
        const projectConfig = {
            // Casos especiales con configuración manual
            'remote-sensing': { icon: 'satellite', category: 'Physics' },
            'chatbot-ela-static': { icon: 'chat', category: 'AI' },
            'chatbot-ela': { icon: 'chat', category: 'AI' },
            'linguistic-reconstruction': { icon: 'language', category: 'Linguistics' },
            'un-data-clustering': { icon: 'chart', category: 'Data Science' },
            // Los nuevos archivos se auto-detectarán con configuración inteligente
        };

        for (const baseFilename of availableProjects) {
            try {
                const esFilePath = this.buildContentUrl(`content/projects/${baseFilename}_ES.md`);
                const enFilePath = this.buildContentUrl(`content/projects/${baseFilename}_EN.md`);
                const esResponse = await fetch(esFilePath);
                const enResponse = await fetch(enFilePath);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    // 🧠 Auto-detectar configuración si no está definida manualmente
                    const config = projectConfig[baseFilename] || this.autoDetectProjectConfig(baseFilename, esContent);
                    
                    const project = {
                        es: this.parseMarkdown(esContent, esFilePath),
                        en: this.parseMarkdown(enContent, enFilePath),
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
        const availableArticles = await this.detectBilingualFiles('./content/writing/');
        
        const articleConfig = {
            'felix': { icon: 'water', category: 'Adventure' },
            'ai-epistemological-lens': { icon: 'brain', category: 'Philosophy' },
            'language-cognitive-tech': { icon: 'brain', category: 'Technology' },
            'rivers-complex-systems': { icon: 'water', category: 'Science' },
            'rivers2-complex-systems': { icon: 'water', category: 'Science' }
        };

        for (const baseFilename of availableArticles) {
            try {
                const esFilePath = this.buildContentUrl(`content/writing/${baseFilename}_ES.md`);
                const enFilePath = this.buildContentUrl(`content/writing/${baseFilename}_EN.md`);
                const esResponse = await fetch(esFilePath);
                const enResponse = await fetch(enFilePath);
                
                if (esResponse.ok && enResponse.ok) {
                    const esContent = await esResponse.text();
                    const enContent = await enResponse.text();
                    
                    const config = articleConfig[baseFilename] || { icon: 'default', category: 'General' };
                    
                    const article = {
                        es: this.parseMarkdown(esContent, esFilePath),
                        en: this.parseMarkdown(enContent, enFilePath),
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

    // 🚀 AUTO-DISCOVERY: Descubrir proyectos automáticamente
    async autoDiscoverProjects() {
        // En local, usar fallback directo. En GitHub Pages, intentar API
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            console.log('🔍 Local environment detected, using fallback detection...');
            return await this.detectBilingualFilesFallback('./content/projects/');
        }
        
        console.log('🔍 Auto-discovering projects using GitHub API...');
        
        try {
            // Usar GitHub API para obtener lista de archivos
            const apiUrl = 'https://api.github.com/repos/nunezmatias/pagina/contents/src/content/projects';
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const files = await response.json();
                
                // Filtrar archivos _ES.md y extraer nombres base
                const projectFiles = files
                    .filter(f => f.name.endsWith('_ES.md'))
                    .map(f => f.name.replace('_ES.md', ''));
                
                console.log(`✅ Auto-discovered ${projectFiles.length} projects:`, projectFiles);
                return projectFiles;
            }
        } catch (error) {
            console.log('⚠️ GitHub API failed, using fallback detection');
        }
        
        // Fallback a detección manual si falla la API
        return await this.detectBilingualFilesFallback('./content/projects/');
    }

    async detectBilingualFilesFallback(folderPath) {
        console.log(`🔍 Using fallback detection for: ${folderPath}`);
        
        // Lista actualizada de archivos conocidos
        const knownFiles = [
            'blockchain-analytics', 'chatbot-ela-static', 'chatbot-ela', 
            'linguistic-reconstruction', 'quantum-computing', 'remote-sensing', 
            'un-data-clustering'
        ];
        
        const discoveredFiles = [];
        
        for (const basename of knownFiles) {
            try {
                const esUrl = this.buildContentUrl(`${folderPath.replace('./', '')}${basename}_ES.md`);
                const enUrl = this.buildContentUrl(`${folderPath.replace('./', '')}${basename}_EN.md`);
                
                const esResponse = await fetch(esUrl);
                const enResponse = await fetch(enUrl);
                
                if (esResponse.ok && enResponse.ok) {
                    discoveredFiles.push(basename);
                    console.log(`✅ Verified bilingual content: ${basename}`);
                } else {
                    console.log(`⚠️ Missing files for: ${basename} (ES: ${esResponse.status}, EN: ${enResponse.status})`);
                }
            } catch (error) {
                console.log(`❌ Error checking: ${basename}`, error);
            }
        }
        
        console.log(`🎯 Fallback discovered ${discoveredFiles.length} projects:`, discoveredFiles);
        return discoveredFiles;
    }

    async detectBilingualFiles(folderPath) {
        console.log(`Scanning for bilingual files in: ${folderPath}`);
        
        try {
            const directoryListUrl = this.buildContentUrl(`${folderPath.replace('./', '')}directory-listing.json`);
            const directoryListResponse = await fetch(directoryListUrl);
            if (directoryListResponse.ok) {
                const directoryData = await directoryListResponse.json();
                const bilingualFiles = directoryData.bilingualFiles || [];
                
                console.log(`Found ${bilingualFiles.length} bilingual files via directory listing`);
                return bilingualFiles;
            }
        } catch (error) {
            console.log(`Directory listing not available for ${folderPath}, using fallback`);
        }

        const knownFiles = {
            './content/projects/': [
                'blockchain-analytics', 'chatbot-ela-static', 'chatbot-ela', 
                'linguistic-reconstruction', 'quantum-computing', 'remote-sensing', 
                'un-data-clustering'
            ],
            './content/writing/': [
                'felix', 'ai-epistemological-lens', 
                'language-cognitive-tech', 'rivers-complex-systems', 'rivers2-complex-systems'
            ]
        };
        
        const discoveredFiles = new Set();
        const known = knownFiles[folderPath] || [];
        
        for (const basename of known) {
            try {
                const esResponse = await fetch(this.buildContentUrl(`${folderPath.replace('./', '')}${basename}_ES.md`));
                const enResponse = await fetch(this.buildContentUrl(`${folderPath.replace('./', '')}${basename}_EN.md`));
                
                if (esResponse.ok && enResponse.ok) {
                    discoveredFiles.add(basename);
                    console.log(`Verified bilingual content: ${basename}`);
                }
            } catch (error) {
                console.log(`Error checking: ${basename}`);
            }
        }
        
        return Array.from(discoveredFiles);
    }

    // 🧠 Auto-detectar configuración de proyecto basado en contenido
    autoDetectProjectConfig(filename, content) {
        console.log(`🔍 Auto-detecting config for: ${filename}`);
        
        const contentLower = content.toLowerCase();
        
        // Auto-detectar icono basado en palabras clave
        let icon = 'default';
        let category = 'General';
        
        // Detección de iconos
        if (contentLower.includes('quantum') || contentLower.includes('qiskit')) {
            icon = 'quantum';
            category = 'Quantum Computing';
        } else if (contentLower.includes('blockchain') || contentLower.includes('crypto')) {
            icon = 'blockchain';
            category = 'Blockchain';
        } else if (contentLower.includes('chat') || contentLower.includes('bot') || contentLower.includes('ai') || contentLower.includes('machine learning')) {
            icon = 'chat';
            category = 'AI';
        } else if (contentLower.includes('language') || contentLower.includes('linguistic') || contentLower.includes('nlp')) {
            icon = 'language';
            category = 'Linguistics';
        } else if (contentLower.includes('data') || contentLower.includes('clustering') || contentLower.includes('analytics')) {
            icon = 'chart';
            category = 'Data Science';
        } else if (contentLower.includes('satellite') || contentLower.includes('remote sensing') || contentLower.includes('physics')) {
            icon = 'satellite';
            category = 'Physics';
        } else if (contentLower.includes('brain') || contentLower.includes('neural') || contentLower.includes('cognitive')) {
            icon = 'brain';
            category = 'Neuroscience';
        }
        
        console.log(`✅ Auto-detected: ${filename} → icon: ${icon}, category: ${category}`);
        return { icon, category };
    }

    parseMarkdown(content, filePath) {
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
                        (value.startsWith('"') && value.endsWith('"'))) {
                        value = value.slice(1, -1);
                    }
                    frontmatter[key] = value;
                }
            });
        }

        const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const basePath = filePath.substring(0, filePath.lastIndexOf('/'));

        return {
            ...frontmatter,
            content: this.markdownToHtml(markdownContent, basePath),
            rawContent: markdownContent
        };
    }

    markdownToHtml(markdown, basePath) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-serif font-bold mb-6 mt-8 text-gray-900">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-serif font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
            .replace(/^[-*+] (.*$)/gm, '<li class="mb-2 text-gray-700 ml-4">$1</li>')
            .replace(/\[embed:([^\]]+)\]/g, (match, content) => {
                const parts = content.split(',').map(part => part.trim());
                const url = parts[0];
                let width = '100%';
                let height = '800px';

                for (let i = 1; i < parts.length; i++) {
                    const attr = parts[i].split('=');
                    if (attr.length === 2) {
                        const key = attr[0].trim();
                        const value = attr[1].trim();
                        if (key === 'width') {
                            width = value;
                        } else if (key === 'height') {
                            height = value;
                        }
                    }
                }

                const src = url.startsWith('http') ? url : `${basePath}/${url}`;
                return `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
            })
            .split('\n\n')
            .map(paragraph => {
                const trimmed = paragraph.trim();
                if (!trimmed) return '';
                
                if (trimmed.includes('<h') || trimmed.includes('<li') || trimmed.includes('<iframe')) {
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
        
        // Agregar efectos Pinterest después del render
        setTimeout(() => {
            this.addPinterestEffects();
        }, 100);
    }

    // Función para agregar efectos dinámicos después del render
    addPinterestEffects() {
        // Animaciones de entrada EXACTAMENTE como el texto de arriba (AOS fade-right/fade-left)
        const cards = document.querySelectorAll('.pinterest-card');
        cards.forEach((card, index) => {
            // Alternar fade-right y fade-left como el texto superior
            const fromLeft = index % 2 === 0;
            
            // Estado inicial exactamente como AOS
            card.style.opacity = '0';
            card.style.transform = fromLeft ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; // 🎛️ Igual que AOS
            
            // Animación de entrada escalonada (igual que el texto de arriba)
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translate3d(0, 0, 0)';
            }, index * 100); // 🎛️ PARÁMETRO: Delay entre tarjetas (100ms)
        });

        // Efectos hover más dramáticos
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.currentTarget);
                this.highlightNeighbors(e.currentTarget);
                this.addHoverGlow(e.currentTarget); // 🎛️ NUEVO: Efecto de brillo
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeHighlightNeighbors();
                this.removeHoverGlow(e.currentTarget);
            });
        });

        // Parallax sutil en scroll
        this.addParallaxEffect();
    }

    // Efecto de ondas al hacer hover
    createRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.className = 'absolute inset-0 pointer-events-none';
        ripple.innerHTML = `
            <div class="absolute inset-0 bg-white/10 rounded-xl animate-ping"></div>
        `;
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Destacar tarjetas vecinas
    highlightNeighbors(hoveredCard) {
        const allCards = document.querySelectorAll('.pinterest-card');
        const hoveredIndex = Array.from(allCards).indexOf(hoveredCard);
        
        allCards.forEach((card, index) => {
            if (Math.abs(index - hoveredIndex) <= 1 && card !== hoveredCard) {
                card.style.transform = 'scale(1.02)';
                card.style.filter = 'brightness(1.1)';
            }
        });
    }

    // Remover destacado de vecinas
    removeHighlightNeighbors() {
        const allCards = document.querySelectorAll('.pinterest-card');
        allCards.forEach(card => {
            if (!card.matches(':hover')) {
                card.style.transform = '';
                card.style.filter = '';
            }
        });
    }

    // Efecto parallax sutil - deshabilitado para evitar interferencia con iconos
    addParallaxEffect() {
        // Parallax deshabilitado para mantener iconos siempre visibles
        console.log('Parallax effect disabled to maintain icon visibility');
    }

    // Agregar efecto de brillo al hover
    addHoverGlow(card) {
        const glowElement = document.createElement('div');
        glowElement.className = 'hover-glow absolute -inset-1 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl blur opacity-75 animate-pulse';
        glowElement.style.zIndex = '-1';
        card.style.position = 'relative';
        card.insertBefore(glowElement, card.firstChild);
    }

    // Remover efecto de brillo
    removeHoverGlow(card) {
        const glowElement = card.querySelector('.hover-glow');
        if (glowElement) {
            glowElement.remove();
        }
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
        
        const currentContent = item[this.currentLanguage];
        const title = currentContent.title || 'Titulo';
        const excerpt = currentContent.excerpt || this.extractExcerpt(currentContent.rawContent);
        const fullContent = currentContent.rawContent || '';

        // Determinar altura basada en contenido
        const cardSize = this.getCardSize(fullContent, excerpt);
        const bgGradient = this.getGradientForCategory(item.category, type);
        const icon = this.getIconForContent(item.icon || 'default');

        const buttonText = type === 'project' 
            ? (this.currentLanguage === 'es' ? 'Ver proyecto' : 'View project')
            : (this.currentLanguage === 'es' ? 'Leer más' : 'Read more');

        card.className = `pinterest-card ${cardSize} bg-white rounded-xl overflow-hidden shadow-lg relative`;

        card.innerHTML = `
            <!-- Sección superior: Gradiente + Icono + Categoría -->
            <div class="h-40 ${bgGradient} relative overflow-hidden">
                <!-- Icono SVG centrado - siempre visible -->
                <div class="absolute inset-0 flex items-center justify-center z-10">
                    <div class="transform transition-transform duration-300 group-hover:scale-105">
                        ${icon}
                    </div>
                </div>
                
                <!-- Categoría en esquina superior derecha -->
                <div class="absolute top-3 right-3">
                    <span class="text-xs text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                        ${item.category}
                    </span>
                </div>
            </div>

            <!-- Sección inferior: Contenido en fondo gris metálico elegante -->
            <div class="bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 p-5 flex-1 flex flex-col">
                <!-- Título -->
                <h3 class="font-serif text-xl font-bold text-gray-900 mb-3 leading-tight">
                    ${title}
                </h3>
                
                <!-- Descripción -->
                <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    ${excerpt}
                </p>
                
                <!-- Botón de acción -->
                <div class="mt-auto">
                    <button class="text-accent inline-flex items-center hover:text-accent-light font-medium transition-all duration-300 group" onclick="openBilingualContent('${item.baseFilename}', '${type}', bilingualLoader.currentLanguage)">
                        <span>${buttonText}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Nueva función para determinar el tamaño de la tarjeta basado en contenido
    getCardSize(content, excerpt) {
        const contentLength = content.length;
        const excerptLength = excerpt.length;
        
        // Algoritmo para determinar altura basada en contenido
        if (contentLength > 3000 || excerptLength > 200) {
            return 'size-xlarge';
        } else if (contentLength > 2000 || excerptLength > 150) {
            return 'size-large';
        } else if (contentLength > 1000 || excerptLength > 100) {
            return 'size-medium';
        } else {
            return 'size-small';
        }
    }

    getGradientForCategory(category, type) {
        const gradients = {
            // Projects
            'Physics': 'bg-gradient-to-br from-green-700 via-teal-800 to-gray-900',
            'AI': 'bg-gradient-to-br from-emerald-600 via-teal-700 to-gray-800',
            'Linguistics': 'bg-gradient-to-br from-emerald-700 via-green-800 to-gray-900',
            'Data Science': 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800',

            // Writing
            'Adventure': 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700',
            'Philosophy': 'bg-gradient-to-br from-teal-700 via-emerald-800 to-gray-900',
            'Technology': 'bg-gradient-to-br from-emerald-600 via-teal-700 to-gray-800',
            'Science': 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800',

            // Default
            'General': 'bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700'
        };

        return gradients[category] || gradients['General'];
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
            'quantum': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>`,
            'blockchain': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>`,
            'default': `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>`
        };

        return icons[iconType] || icons['default'];
    }
}

// Variable global para el loader bilingue
let bilingualLoader;

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando BilingualContentLoader...');
    setTimeout(() => {
        bilingualLoader = new BilingualContentLoader();
    }, 100);
});

// Function to open CV
async function openCV(language) {
    try {
        const suffix = language === 'es' ? '_ES' : '_EN';
        const filename = `cv${suffix}.md`;
        
        const cvUrl = bilingualLoader.buildContentUrl(`content/${filename}`);
        const response = await fetch(cvUrl);
        
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

// Function to create CV page
function createCVPage(parsedContent, language) {
    // Forzar modo claro eliminando cualquier clase dark del documento
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Limpiar localStorage de cualquier tema oscuro guardado
    localStorage.removeItem('theme');
    localStorage.removeItem('simpleNightMode');
    
    const fullPage = document.createElement('div');
    fullPage.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
    fullPage.style.backgroundColor = "#ffffff";
    fullPage.style.color = "#000000";    
    const backText = language === 'es' ? 'Volver' : 'Back';
    const aboutText = language === 'es' ? 'Sobre Mi' : 'About Me';
    const projectsText = language === 'es' ? 'Proyectos' : 'Projects';
    const writingText = language === 'es' ? 'Escritos' : 'Writing';
    const contactText = language === 'es' ? 'Contacto' : 'Contact';
    
    fullPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <header class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav class="flex justify-between items-center py-4">
                        <a href="#" onclick="this.closest('.fixed').remove()" class="font-serif text-xl sm:text-2xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Matías Núñez
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
    
    // Forzar estilos blancos con CSS inline
    const forceWhiteStyle = document.createElement("style");
    forceWhiteStyle.innerHTML = `
        .fixed.inset-0 {
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        .fixed.inset-0 .bg-gradient-to-br {
            background: linear-gradient(to bottom right, #f9fafb, #ffffff) !important;
        }
        .fixed.inset-0 .bg-white {
            background-color: #ffffff !important;
        }
        .fixed.inset-0 .text-gray-900 {
            color: #111827 !important;
        }
        .fixed.inset-0 .text-gray-700 {
            color: #374151 !important;
        }
    `;
    document.head.appendChild(forceWhiteStyle);    fullPage.scrollTop = 0;
}

// Function to change CV language
function changeCVLanguage(newLanguage) {
    if (bilingualLoader) {
        bilingualLoader.currentLanguage = newLanguage;
    }
    
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage && fullPage.querySelector('.cv-content')) {
        const article = fullPage.querySelector('article');
        if (article) {
            article.style.opacity = '0.5';
            article.style.transition = 'opacity 0.3s ease';
        }
        
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
                
                fullPage.remove();
                createCVPage(parsedContent, newLanguage);
                
            } catch (error) {
                console.error('Error switching CV language:', error);
                fullPage.remove();
                alert('Error cambiando idioma del CV / Error switching CV language');
            }
        }, 150);
    }
}

// Function to open bilingual content
async function openBilingualContent(baseFilename, type, language) {
    try {
        const folder = type === 'project' ? 'projects' : 'writing';
        const suffix = language === 'es' ? '_ES' : '_EN';
        const filename = `${baseFilename}${suffix}.md`;
        
        const contentUrl = bilingualLoader.buildContentUrl(`content/${folder}/${filename}`);
        const response = await fetch(contentUrl);
        
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
    // Forzar modo claro eliminando cualquier clase dark del documento
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Limpiar localStorage de cualquier tema oscuro guardado
    localStorage.removeItem('theme');
    localStorage.removeItem('simpleNightMode');
    
    const fullPage = document.createElement('div');
    fullPage.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
    fullPage.style.backgroundColor = "#ffffff";
    fullPage.style.color = "#000000";    
    const backText = language === 'es' ? 'Volver' : 'Back';
    const aboutText = language === 'es' ? 'Sobre Mi' : 'About Me';
    const projectsText = language === 'es' ? 'Proyectos' : 'Projects';
    const writingText = language === 'es' ? 'Escritos' : 'Writing';
    const contactText = language === 'es' ? 'Contacto' : 'Contact';
    
    fullPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <header class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav class="flex justify-between items-center py-4">
                        <a href="#" onclick="this.closest('.fixed').remove()" class="font-serif text-xl sm:text-2xl font-bold text-gray-900 hover:text-accent transition-colors">
                            Matías Núñez
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
    
    // Forzar estilos blancos con CSS inline
    const forceWhiteStyle = document.createElement("style");
    forceWhiteStyle.innerHTML = `
        .fixed.inset-0 {
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        .fixed.inset-0 .bg-gradient-to-br {
            background: linear-gradient(to bottom right, #f9fafb, #ffffff) !important;
        }
        .fixed.inset-0 .bg-white {
            background-color: #ffffff !important;
        }
        .fixed.inset-0 .text-gray-900 {
            color: #111827 !important;
        }
        .fixed.inset-0 .text-gray-700 {
            color: #374151 !important;
        }
    `;
    document.head.appendChild(forceWhiteStyle);    fullPage.scrollTop = 0;
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
    if (bilingualLoader) {
        bilingualLoader.currentLanguage = newLanguage;
    }
    
    const fullPage = document.querySelector('.fixed.inset-0.bg-white.z-50');
    if (fullPage) {
        const article = fullPage.querySelector('article');
        if (article) {
            article.style.opacity = '0.5';
            article.style.transition = 'opacity 0.3s ease';
        }
        
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
                
                fullPage.remove();
                createBilingualContentPage(parsedContent, newLanguage, baseFilename, type);
                
            } catch (error) {
                console.error('Error switching language:', error);
                fullPage.remove();
                alert('Error cambiando idioma / Error switching language');
            }
        }, 150);
    } else {
        bilingualLoader.updateContent();
    }
}