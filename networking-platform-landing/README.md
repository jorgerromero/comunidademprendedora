# Red de Emprendedores Locales - Landing Page

Landing page moderna, minimalista y responsiva para una plataforma de networking de emprendedores locales.

## Estructura
- `index.html`: Página principal
- `styles.css`: Estilos en azul y blanco, diseño minimalista y responsivo
- `script.js`: Para futuras funcionalidades dinámicas
- `logo.svg`: Logo simple de la plataforma

## Cómo usar
Abre `index.html` en tu navegador preferido. El diseño es compatible con dispositivos móviles y los principales navegadores.

## Lista pública de emprendedores
Cada registro se añade a una lista visible para todos los visitantes de la página. La información se almacena en el navegador (localStorage), por lo que es ideal para pruebas y demostraciones locales. Para un entorno real, se recomienda conectar con una base de datos.

## Cómo publicar en Google Drive o un hosting estático

1. **Google Drive:**
   - Sube todos los archivos del proyecto a una carpeta en tu Google Drive.
   - Haz clic derecho en `index.html` > "Obtener enlace" > selecciona "Cualquier persona con el enlace".
   - Copia el enlace y reemplaza `view` por `preview` en la URL para verlo como página web.
   - Ejemplo: `https://drive.google.com/file/d/IDDELARCHIVO/preview`

2. **Cualquier hosting estático:**
   - Sube todos los archivos a servicios como Netlify, Vercel, GitHub Pages o tu propio servidor.

3. **Google Sites:**
   - Google Sites no permite subir HTML/CSS/JS directamente, pero puedes incrustar la página si la alojas en otro sitio.

## Personalización y migración
- Para hacer la lista realmente pública y persistente entre todos los usuarios, migra el almacenamiento a una base de datos (por ejemplo, Firebase, Supabase, etc.).
- Puedes modificar fácilmente los textos, colores y estructura desde los archivos fuente.
