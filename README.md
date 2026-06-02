# Stratevia AI — Sitio web

Landing page de Stratevia AI con hero 3D animado (Three.js).

## Estructura
- `index.html` — contenido y secciones
- `styles.css` — estilos
- `app.js` — fondo 3D + interacciones
- `vercel.json` — config de despliegue

## Desplegar en Vercel (3 opciones)

**A. Arrastrar y soltar (lo más rápido):**
1. Entra a vercel.com → New Project → "Deploy" → arrastra esta carpeta.

**B. Con GitHub:**
1. Sube esta carpeta a un repo en GitHub.
2. En Vercel: New Project → Import del repo → Deploy.
3. No requiere build: es sitio estático.

**C. Con Vercel CLI:**
```
npm i -g vercel
vercel
```

## Conectar tu dominio
En Vercel → Project → Settings → Domains → agrega `www.strateviaapp.com`
y sigue las instrucciones DNS (un registro CNAME a `cname.vercel-dns.com`).

## Pendientes / personalización
- **Logo:** reemplaza el SVG en el `<header>` y `<footer>` cuando tengas el definitivo.
- **Formulario:** hoy solo muestra confirmación. Para recibir mensajes conecta:
  - Supabase (insertar en una tabla `contactos`), o
  - un endpoint en Render, o
  - un servicio como Formspree.
- **Correo:** cambia `hola@strateviaapp.com` por el real.
