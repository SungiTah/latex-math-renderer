import './style.css'
import katex from 'katex'
import 'katex/dist/katex.css'
import html2canvas from 'html2canvas'

class LaTeXRenderer {
  constructor() {
    this.initializeElements()
    this.initializeEventListeners()
    this.initializeTheme()
    this.initializeHistory()
    this.renderMath()
  }

  initializeElements() {
    // Core elements
    this.latexInput = document.getElementById('latex-input')
    this.mathOutput = document.getElementById('math-output')
    this.historyPanel = document.getElementById('history-panel')
    
    // Buttons
    this.themeToggle = document.getElementById('theme-toggle')
    this.clearBtn = document.getElementById('clear-btn')
    this.copyBtn = document.getElementById('copy-btn')
    this.exportPngBtn = document.getElementById('export-png-btn')
    this.exportSvgBtn = document.getElementById('export-svg-btn')
    this.clearHistoryBtn = document.getElementById('clear-history-btn')
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn')
    
    // Toast notification
    this.toast = document.getElementById('toast')
    this.toastMessage = document.getElementById('toast-message')
    
    // History storage
    this.history = JSON.parse(localStorage.getItem('latex-history') || '[]')
    this.currentInput = ''
    this.renderTimeout = null
  }

  initializeEventListeners() {
    // Input events
    this.latexInput.addEventListener('input', (e) => {
      clearTimeout(this.renderTimeout)
      this.renderTimeout = setTimeout(() => {
        this.currentInput = e.target.value
        this.renderMath()
      }, 300) // Debounce for 300ms
    })

    this.latexInput.addEventListener('keydown', (e) => {
      // Tab key for indentation
      if (e.key === 'Tab') {
        e.preventDefault()
        const start = this.latexInput.selectionStart
        const end = this.latexInput.selectionEnd
        const value = this.latexInput.value
        this.latexInput.value = value.substring(0, start) + '  ' + value.substring(end)
        this.latexInput.selectionStart = this.latexInput.selectionEnd = start + 2
      }
    })

    // Button events
    this.themeToggle.addEventListener('click', () => this.toggleTheme())
    this.clearBtn.addEventListener('click', () => this.clearInput())
    this.copyBtn.addEventListener('click', () => this.copyToClipboard())
    this.exportPngBtn.addEventListener('click', () => this.exportAsImage('png'))
    this.exportSvgBtn.addEventListener('click', () => this.exportAsImage('svg'))
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory())

    // Mobile menu (placeholder for future mobile optimizations)
    this.mobileMenuBtn.addEventListener('click', () => {
      this.showToast('Mobile menu coming soon!', 'info')
    })

    // Window events
    window.addEventListener('beforeunload', () => {
      this.saveToHistory()
    })
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
    }
  }

  initializeHistory() {
    this.renderHistory()
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    // Add animation effect
    document.body.style.transition = 'background-color 0.3s ease'
    setTimeout(() => {
      document.body.style.transition = ''
    }, 300)
  }

  renderMath() {
    const input = this.latexInput.value.trim()
    
    if (!input) {
      this.mathOutput.innerHTML = `
        <div class="text-center animate-fade-in">
          <i class="fas fa-square-root-variable text-4xl mb-4 text-gray-300 dark:text-gray-600"></i>
          <p class="text-lg">Start typing LaTeX to see the preview</p>
          <p class="text-sm mt-2">Your mathematical expressions will appear here in real-time</p>
        </div>
      `
      return
    }

    try {
      // Determine if it's a display math or inline math
      const isDisplayMath = input.includes('\\begin{') || 
                           input.includes('\\frac') || 
                           input.includes('\\sum') || 
                           input.includes('\\int') || 
                           input.includes('\\prod') ||
                           input.includes('\\lim') ||
                           input.startsWith('$$') ||
                           input.includes('\\displaystyle')

      const html = katex.renderToString(input, {
        displayMode: isDisplayMath,
        throwOnError: false,
        errorColor: '#e53e3e',
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}",
        },
        trust: false
      })
      
      this.mathOutput.innerHTML = `
        <div class="math-container animate-bounce-in p-4 text-center">
          ${html}
        </div>
      `
      
      // Enable export buttons
      this.exportPngBtn.disabled = false
      this.exportSvgBtn.disabled = false
      this.exportPngBtn.classList.remove('opacity-50', 'cursor-not-allowed')
      this.exportSvgBtn.classList.remove('opacity-50', 'cursor-not-allowed')
      
    } catch (error) {
      this.mathOutput.innerHTML = `
        <div class="text-center p-4 animate-fade-in">
          <div class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-3"></i>
            <p class="text-red-700 dark:text-red-300 font-medium">LaTeX Error</p>
            <p class="text-red-600 dark:text-red-400 text-sm mt-2">${error.message}</p>
          </div>
        </div>
      `
      
      // Disable export buttons
      this.exportPngBtn.disabled = true
      this.exportSvgBtn.disabled = true
      this.exportPngBtn.classList.add('opacity-50', 'cursor-not-allowed')
      this.exportSvgBtn.classList.add('opacity-50', 'cursor-not-allowed')
    }
  }

  clearInput() {
    this.latexInput.value = ''
    this.currentInput = ''
    this.renderMath()
    this.latexInput.focus()
    this.showToast('Input cleared!', 'success')
  }

  async copyToClipboard() {
    const text = this.latexInput.value
    if (!text.trim()) {
      this.showToast('Nothing to copy!', 'warning')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      this.showToast('LaTeX copied to clipboard!', 'success')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      this.showToast('LaTeX copied to clipboard!', 'success')
    }
  }

  async exportAsImage(format) {
    const mathContainer = this.mathOutput.querySelector('.math-container')
    if (!mathContainer) {
      this.showToast('Nothing to export!', 'warning')
      return
    }

    try {
      this.showToast('Generating image...', 'info')
      
      const canvas = await html2canvas(mathContainer, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      })

      if (format === 'png') {
        // Export as PNG
        const link = document.createElement('a')
        link.download = `latex-math-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        this.showToast('PNG exported successfully!', 'success')
      } else if (format === 'svg') {
        // For SVG, we'll use the KaTeX SVG output
        try {
          const svgHtml = katex.renderToString(this.latexInput.value, {
            displayMode: true,
            output: 'html', // KaTeX doesn't directly output SVG, so we'll use HTML
            throwOnError: false
          })
          
          // Create a temporary container to convert HTML to SVG
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = svgHtml
          
          // Convert to SVG (simplified approach)
          const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
              <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: KaTeX_Main; padding: 20px;">
                  ${svgHtml}
                </div>
              </foreignObject>
            </svg>
          `
          
          const blob = new Blob([svgData], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `latex-math-${Date.now()}.svg`
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
          this.showToast('SVG exported successfully!', 'success')
        } catch (svgError) {
          // Fallback to PNG if SVG export fails
          const link = document.createElement('a')
          link.download = `latex-math-${Date.now()}.png`
          link.href = canvas.toDataURL('image/png')
          link.click()
          this.showToast('Exported as PNG (SVG fallback)', 'warning')
        }
      }
    } catch (error) {
      console.error('Export error:', error)
      this.showToast('Export failed. Please try again.', 'error')
    }
  }

  saveToHistory() {
    const input = this.latexInput.value.trim()
    if (!input || this.history.some(item => item.latex === input)) {
      return // Don't save empty or duplicate entries
    }

    const historyItem = {
      id: Date.now(),
      latex: input,
      timestamp: new Date().toISOString(),
      preview: this.generatePreview(input)
    }

    this.history.unshift(historyItem)
    
    // Keep only the last 20 items
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20)
    }

    localStorage.setItem('latex-history', JSON.stringify(this.history))
    this.renderHistory()
  }

  generatePreview(latex) {
    try {
      return katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        maxSize: 10,
        maxExpand: 10
      })
    } catch (error) {
      return latex.substring(0, 50) + (latex.length > 50 ? '...' : '')
    }
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.historyPanel.innerHTML = `
        <div class="text-center text-gray-500 dark:text-gray-400 py-8">
          <i class="fas fa-clock text-3xl mb-3 text-gray-300 dark:text-gray-600"></i>
          <p>No equations in history yet</p>
          <p class="text-sm mt-1">Your recently used equations will appear here</p>
        </div>
      `
      return
    }

    const historyHTML = this.history.map(item => `
      <div class="history-item group" data-latex="${this.escapeHtml(item.latex)}" data-id="${item.id}">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
              ${new Date(item.timestamp).toLocaleString()}
            </div>
            <div class="math-preview text-sm mb-2">
              ${item.preview}
            </div>
            <div class="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">
              ${this.escapeHtml(item.latex)}
            </div>
          </div>
          <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button class="load-history-btn p-1 text-blue-500 hover:text-blue-600 text-xs" data-id="${item.id}">
              <i class="fas fa-upload"></i>
            </button>
            <button class="delete-history-btn p-1 text-red-500 hover:text-red-600 text-xs" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')

    this.historyPanel.innerHTML = historyHTML

    // Add event listeners for history items
    this.historyPanel.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const latex = item.dataset.latex
          this.loadFromHistory(latex)
        }
      })
    })

    this.historyPanel.querySelectorAll('.load-history-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = parseInt(btn.dataset.id)
        const item = this.history.find(h => h.id === id)
        if (item) {
          this.loadFromHistory(item.latex)
        }
      })
    })

    this.historyPanel.querySelectorAll('.delete-history-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = parseInt(btn.dataset.id)
        this.deleteHistoryItem(id)
      })
    })
  }

  loadFromHistory(latex) {
    this.latexInput.value = latex
    this.currentInput = latex
    this.renderMath()
    this.latexInput.focus()
    this.showToast('Equation loaded from history!', 'success')
  }

  deleteHistoryItem(id) {
    this.history = this.history.filter(item => item.id !== id)
    localStorage.setItem('latex-history', JSON.stringify(this.history))
    this.renderHistory()
    this.showToast('History item deleted!', 'success')
  }

  clearHistory() {
    if (this.history.length === 0) {
      this.showToast('History is already empty!', 'info')
      return
    }

    this.history = []
    localStorage.setItem('latex-history', JSON.stringify(this.history))
    this.renderHistory()
    this.showToast('History cleared!', 'success')
  }

  showToast(message, type = 'success') {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }

    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }

    this.toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50`
    this.toast.innerHTML = `
      <div class="flex items-center">
        <i class="${icons[type]} mr-2"></i>
        <span>${message}</span>
      </div>
    `

    // Show toast
    this.toast.style.transform = 'translateX(0)'
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      this.toast.style.transform = 'translateX(100%)'
    }, 3000)
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Sample LaTeX expressions for quick start
const sampleExpressions = [
  '\\frac{a}{b}',
  '\\sqrt{x^2 + y^2}',
  '\\sum_{i=1}^{n} x_i',
  '\\int_{0}^{\\infty} e^{-x} dx',
  '\\lim_{x \\to \\infty} \\frac{1}{x}',
  '\\begin{cases} x & \\text{if } x > 0 \\\\ 0 & \\text{otherwise} \\end{cases}',
  '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
  '\\alpha + \\beta = \\gamma',
  'E = mc^2',
  '\\nabla \\cdot \\vec{F} = \\rho'
]

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new LaTeXRenderer()
  
  // Add sample expressions to the placeholder
  const textarea = document.getElementById('latex-input')
  if (textarea) {
    textarea.placeholder = `Enter your LaTeX expression here...

Examples:
${sampleExpressions.slice(0, 5).join('\n')}

Try typing any mathematical expression!`
  }
  
  // Auto-save history on input
  setInterval(() => {
    if (app.currentInput && app.currentInput.trim()) {
      app.saveToHistory()
    }
  }, 10000) // Save every 10 seconds if there's content
})

// Export for potential future use
export default LaTeXRenderer