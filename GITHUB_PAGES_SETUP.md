# GitHub Pages Setup Guide

## Configuración del Perfil Hyper Revolucionario

Este repositorio está configurado para desplegar automáticamente el sitio web avanzado en GitHub Pages.

### Pasos de Configuración

1. **Habilitar GitHub Pages**
   - Ve a Settings > Pages en tu repositorio
   - En "Source", selecciona "GitHub Actions"
   - El workflow `deploy-pages.yml` se ejecutará automáticamente

2. **Configurar Secrets (Opcional)**
   - Ve a Settings > Secrets and variables > Actions
   - Agrega `WAKATIME_API_KEY` si quieres métricas de WakaTime (opcional)

3. **Verificar Despliegue**
   - Una vez configurado, el sitio estará disponible en:
   - `https://descambiado.github.io/descambiado/`

### Estructura del Sitio Web

```
web/
├── index.html      # Landing page principal
├── style.css       # Estilos con tema morado/hacker
├── script.js       # Lógica interactiva y APIs
└── .nojekyll       # Desactiva Jekyll processing
```

### Características del Sitio

- **Terminal Interactiva**: Terminal hacker funcional con comandos reales
- **Métricas en Tiempo Real**: Integración con GitHub API
- **Efectos Visuales**: Partículas, glitch, neon, matrix
- **Dashboard Dinámico**: Visualización de proyectos y estadísticas
- **Diseño Responsive**: Adaptado para móviles y desktop

### Automatización

El perfil se actualiza automáticamente mediante GitHub Actions:

- **update-profile.yml**: Actualiza métricas y README cada hora
- **update-metrics.yml**: Actualiza métricas cada 6 horas
- **generate-content.yml**: Genera contenido dinámico diariamente
- **deploy-pages.yml**: Despliega el sitio web cuando hay cambios

### Personalización

Edita `config/profile-config.json` para personalizar:
- Información del perfil
- Colores del tema
- Enlaces sociales
- Proyectos destacados

### Troubleshooting

Si el sitio no se despliega:
1. Verifica que GitHub Pages esté habilitado
2. Revisa los logs de GitHub Actions
3. Asegúrate de que el workflow `deploy-pages.yml` esté en `.github/workflows/`
4. Verifica que los archivos estén en la carpeta `web/`
