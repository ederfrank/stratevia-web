# Stratevia AI — Hero con VIDEO del robot

El robot ahora es un video real en bucle continuo y silenciado, a la derecha,
con el texto a la izquierda (composición split).

## Archivos
- index.html, styles.css, hero.css, app.js
- robot.mp4 (video optimizado, 1.6 MB, sin audio, carga progresiva)
- robot-poster.jpg (primer cuadro: se muestra mientras carga el video)
- vercel.json

## Para verlo
Doble clic en index.html (el video se reproduce solo, silenciado).

## Para publicar (reemplaza tu web actual)
Sube a tu repo GitHub `ederfrank/stratevia-web` y reemplaza/agrega:
  index.html, styles.css, hero.css, app.js, robot.mp4, robot-poster.jpg, vercel.json
IMPORTANTE: elimina del repo los archivos del hero anterior que ya no uses
(robot.jpg si lo habías subido). Commit -> Vercel actualiza solo.

## Formulario -> tu correo
En app.js reemplaza TU_PROJECT_URL y TU_ANON_KEY con tus llaves de Supabase
(Settings -> API). Antes de eso funciona en "modo demo".
