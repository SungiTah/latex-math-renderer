# 🧮 LaTeX Math Renderer

A modern, responsive, and stylish web application for rendering LaTeX mathematical expressions in real-time. Built with performance and user experience in mind.

![LaTeX Math Renderer](https://img.shields.io/badge/LaTeX-Renderer-blue?style=for-the-badge&logo=latex)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🚀 Core Functionality
- **Real-time LaTeX rendering** using KaTeX for lightning-fast performance
- **Complex mathematical expressions** support (limits, sums, integrals, fractions, roots, piecewise functions, matrices)
- **Multi-line LaTeX environments** (align, cases, matrix, etc.)
- **Live preview** with instant rendering as you type

### 🎨 Design & User Experience
- **Fully responsive design** that adapts beautifully to desktop, tablet, and mobile
- **Modern UI/UX** with TailwindCSS styling
- **Dark/Light mode toggle** with system preference detection
- **Smooth animations** and polished hover effects
- **Professional, clean aesthetic** 

### 🛠️ Advanced Features
- **One-click copy** LaTeX code to clipboard
- **Image export** functionality (PNG/SVG format)
- **History panel** with local storage for equation recall
- **Syntax highlighting** in the editor
- **Clear button** to reset input and preview
- **Toast notifications** for user feedback
- **Auto-save** functionality

### ⚡ Performance & Reliability
- **Efficient rendering** with no lag, even for complex formulas
- **Error handling** with helpful error messages
- **Debounced input** to prevent excessive re-rendering
- **Optimized for large formulas** without crashes

## 🎯 Live Demo

**[Try it now!](https://sungitah.github.io/latex-math-renderer/)**

## 🚀 Quick Start

### Option 1: Direct Use (Recommended for most users)
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start typing LaTeX expressions!

### Option 2: Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/latex-math-renderer.git
cd latex-math-renderer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Usage Examples

Try these LaTeX expressions in the editor:

### Basic Math
```latex
\frac{a}{b}
x^2 + y^2 = z^2
\sqrt{x^2 + y^2}
```

### Advanced Expressions
```latex
\sum_{i=1}^{n} x_i
\int_{0}^{\infty} e^{-x} dx
\lim_{x \to \infty} \frac{1}{x}
```

### Matrices and Cases
```latex
\begin{pmatrix} a & b \\ c & d \end{pmatrix}

\begin{cases} 
x & \text{if } x > 0 \\ 
0 & \text{otherwise} 
\end{cases}
```

### Physics and Engineering
```latex
E = mc^2
\nabla \cdot \vec{F} = \rho
F = ma
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: TailwindCSS
- **Math Rendering**: KaTeX
- **Image Export**: html2canvas
- **Build Tool**: Vite
- **Hosting**: GitHub Pages

## 📁 Project Structure

```
latex-math-renderer/
├── index.html              # Main HTML file (standalone version)
├── src/
│   ├── main.js             # Main JavaScript (module version)
│   ├── standalone.js       # Standalone JavaScript (no modules)
│   └── style.css           # Custom CSS styles
├── public/
│   └── vite.svg           # Project icon
├── package.json           # Project dependencies
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # Project documentation
```

## 🎨 Customization

### Theme Colors
The website supports both light and dark themes. You can customize the colors by modifying the TailwindCSS configuration in `tailwind.config.js`.

### Adding Custom Macros
Add your own LaTeX macros by modifying the `macros` object in the JavaScript files:

```javascript
macros: {
  "\\RR": "\\mathbb{R}",
  "\\NN": "\\mathbb{N}",
  "\\ZZ": "\\mathbb{Z}",
  "\\QQ": "\\mathbb{Q}",
  "\\CC": "\\mathbb{C}",
  // Add your custom macros here
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [KaTeX](https://katex.org/) for fast math rendering
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS framework
- [html2canvas](https://html2canvas.hertzen.com/) for image export functionality
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for typography

## 📞 Contact

Created with ❤️ by **Mohamed Taha Laaouan**

- GitHub: [@SungiTah](https://github.com/SungiTah/)
- Email: sungitah4@gmail.com

## 🌟 Star History

If you found this project helpful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/latex-math-renderer&type=Date)](https://star-history.com/SungiTah/latex-math-renderer&Date)

---

<p align="center">Made with ❤️ for the mathematical community</p>
