# Página Web - @descambiado

## Uso Local

Abre `index.html` directamente en tu navegador. Funciona sin servidor.

## Despliegue

### Opción 1: GitHub Pages
1. Ve a Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. La página estará en: `https://descambiado.github.io/descambiado/`

### Opción 2: Servidor Local Simple
```bash
# Python 3
python -m http.server 8000

# Node.js (con http-server)
npx http-server

# PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Netlify/Vercel
Arrastra la carpeta o conecta el repositorio. Funciona automáticamente.

## Características

- Minimalista y limpio
- GIFs Y2K con efectos pixelados
- Transiciones suaves
- Responsive
- Sin dependencias externas (solo APIs de GitHub para stats)
- Tema morado consistente
