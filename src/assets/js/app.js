// Configuración de Tailwind
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

// Inicializar AOS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });
});

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});