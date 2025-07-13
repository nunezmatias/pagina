        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dark: '#0a1921',
                        light: '#f5f5f5',
                        accent: '#1a5a7a',
                        'accent-light': '#3a8bb2',
                        secondary: '#2d4b40',
                        tertiary: '#c8a87d',
                    },
                    fontFamily: {
                        serif: ['"Playfair Display"', 'Georgia', 'serif'],
                        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
                    },
                    animation: {
                        'gradient': 'gradient 8s ease infinite',
                    },
                    keyframes: {
                        gradient: {
                            '0%, 100%': {
                                'background-position': '0% 50%'
                            },
                            '50%': {
                                'background-position': '100% 50%'
                            },
                        }
                    },
                },
            },
        }
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true
            });
        });

        // Función para efecto de scroll en el header
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
                header.classList.add('bg-white/95');
                header.classList.remove('bg-white/90');
            } else {
                header.classList.remove('shadow-md');
                header.classList.add('bg-white/90');
                header.classList.remove('bg-white/95');
            }
        });

        // Navegación suave al hacer clic en los enlaces
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
