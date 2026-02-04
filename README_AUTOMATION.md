# Sistema de Automatización del Perfil

## Descripción

Este perfil de GitHub está completamente automatizado mediante scripts Python y GitHub Actions que actualizan métricas, generan contenido dinámico y mantienen el README actualizado.

## Componentes

### Scripts Python

1. **`scripts/fetch-metrics.py`**
   - Obtiene estadísticas de GitHub API
   - Opcionalmente obtiene métricas de WakaTime
   - Guarda los datos en `metrics.json`

2. **`scripts/update-readme.py`**
   - Lee métricas y configuración
   - Actualiza secciones dinámicas del README
   - Genera badges y estadísticas actualizadas

### GitHub Actions Workflows

1. **`.github/workflows/update-profile.yml`**
   - Se ejecuta cada hora
   - Actualiza métricas y README
   - Hace commit automático de cambios

2. **`.github/workflows/update-metrics.yml`**
   - Se ejecuta cada 6 horas
   - Solo actualiza métricas
   - Guarda artefactos para análisis

3. **`.github/workflows/generate-content.yml`**
   - Se ejecuta diariamente a medianoche UTC
   - Genera contenido dinámico basado en actividad
   - Actualiza README con nueva información

4. **`.github/workflows/deploy-pages.yml`**
   - Se ejecuta cuando hay cambios en `web/`
   - Despliega el sitio web a GitHub Pages

## Configuración

### Variables de Entorno

- `WAKATIME_API_KEY` (opcional): Para métricas de WakaTime

### Archivos de Configuración

- `config/profile-config.json`: Configuración del perfil
- `metrics.json`: Métricas actualizadas (generado automáticamente)

## Uso Manual

### Ejecutar scripts localmente

```bash
# Instalar dependencias
pip install requests

# Obtener métricas
cd scripts
python fetch-metrics.py

# Actualizar README
python update-readme.py
```

### Ejecutar workflows manualmente

Ve a Actions > [Workflow Name] > Run workflow

## Personalización

Edita `config/profile-config.json` para cambiar:
- Información del perfil
- Colores del tema
- Proyectos destacados
- Configuración de automatización

## Troubleshooting

### Los workflows no se ejecutan
- Verifica que estén en `.github/workflows/`
- Revisa los permisos del repositorio
- Asegúrate de que GitHub Actions esté habilitado

### Los scripts fallan
- Verifica que Python 3.11+ esté instalado
- Instala las dependencias: `pip install requests`
- Revisa los logs de error en GitHub Actions

### El README no se actualiza
- Verifica que los scripts tengan permisos de escritura
- Revisa que `metrics.json` exista y tenga datos válidos
- Comprueba los logs del workflow
