module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './projects/**/*.md',
    './_posts/**/*.md',
    './index.html',
    './en/index.html'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a1921',
        light: '#f8fafc',
        accent: '#f97316',
        'accent-light': '#fb923c',
        secondary: '#10b981',
        tertiary: '#0ea5e9'
      }
    }
  },
  plugins: []
}
