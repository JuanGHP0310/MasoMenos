
# MasoMenos — Higher or Lower (ES/EN)

Juego web estático con 4 modos: **Población**, **Universo**, **Marvel** y **BTS**. Listo para subir a GitHub y publicar como Static Site en Render.com.

## Estructura
```
/
├─ index.html
├─ robots.txt
├─ sitemap.xml
├─ assets/style.css
├─ js/app.js
└─ data/
   ├─ population.json
   ├─ universe.json
   ├─ marvel.json
   └─ bts.json
```

## Imágenes
- **Población**: flags desde `https://flagcdn.com/w320/{iso}.png` (dominio público).
- **Universo/Marvel/BTS**: SVG generados incrustados (placeholders propios, sin copyright).

> Si desea sustituirlos por imágenes, colóquelas en `/img` y cambie las URLs en cada JSON.

## Multi-idioma
Cambie ES/EN con los botones de la cabecera. Preguntas, labels y record se adaptan.

## AdSense
En `index.html` ya está el script de Auto Ads. Reemplace `ca-pub-XXXXXXXXXXXXXXXX` por su “Publisher ID”.

## SEO
- `robots.txt` y `sitemap.xml` incluidos.
- Complete la meta de verificación de Google Search Console en `<head>` (comentada) y envíe el sitemap ya publicado.

---

## PASO A PASO — Subida a GitHub y publicación en Render.com

### 1) Crear el repo en GitHub
1. Entre en GitHub → **New Repository** → Nombre: `masomenos` (público).
2. No añada archivos extra (README/License) — los subiremos nosotros.

### 2) Subir los archivos
**Opción A (web):**
- Abra su nuevo repo → **Add file → Upload files**.
- Arrastre todo el contenido de esta carpeta (no la carpeta en sí, sino sus archivos y subcarpetas).
- **Commit changes**.

**Opción B (Git):**
```bash
git init
git remote add origin https://github.com/<SU_USUARIO>/masomenos.git
git add .
git commit -m "MasoMenos v1"
git push -u origin main
```

### 3) Publicar en Render.com (Static Site)
1. Vaya a Render.com → **New** → **Static Site**.
2. Conecte su cuenta de GitHub (si no lo ha hecho).
3. Seleccione el repo `masomenos`.
4. **Build Command:** *(vacío)* (no hay build).
5. **Publish Directory:** `/` (raíz del repo).
6. **Static Site** → cree el servicio. Render desplegará automáticamente.

> Para futuras actualizaciones: cada push a `main` generará un nuevo deploy.

### 4) Configurar Google AdSense
1. Cree su cuenta en AdSense y obtenga su **Publisher ID** (`ca-pub-...`).
2. Edite `index.html` y reemplace el `client=ca-pub-XXXXXXXXXXXXXXXX` por su ID.
3. Espere a que AdSense valide el sitio. (Puede tardar).

### 5) Google Search Console (Indexación)
1. Entre en **Google Search Console** → *Add property* → *URL prefix* y pegue la URL de Render (p. ej., `https://masomenos.onrender.com`).
2. Seleccione el método **HTML tag** → copie el `meta` de verificación.
3. Péguelo en `index.html` (ya hay un placeholder comentado).
4. Suba el cambio al repo → *Verify*.
5. Envíe `sitemap.xml` desde Search Console.

---

## Notas importantes
- Las cifras son **estimaciones razonables** para propósito lúdico; no son oficiales.
- En el modo **Marvel** y **BTS**, las “imágenes” son SVG generados (placeholders). Usar imágenes con copyright de personajes o artistas no está permitido sin licencia.
- El récord se guarda en `localStorage` por modo.
- Accesible con teclado (Enter/Espacio para seleccionar).

¡Disfrute!
