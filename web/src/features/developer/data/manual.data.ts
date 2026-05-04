export type ManualSection = {
  id: string;
  title: string;
  description: string;
  content: string;
};

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'bienvenida',
    title: 'Bienvenida al programa de desarrolladores',
    description: 'Descubre qué es el programa Dev de M4G, quién puede participar y qué beneficios obtienes como contribuidor oficial de la plataforma.',
    content: `
Made4Gamers (M4G) es una plataforma de juegos en la que los desarrolladores verificados pueden publicar sus juegos y llegar a miles de jugadores. Este manual te guiará a través de todo el proceso: desde los requisitos técnicos hasta las buenas prácticas para maximizar el impacto de tu juego.

> [!IMPORTANT]
> Si estás leyendo este manual con acceso al portal de desarrollador, tu solicitud ya fue aprobada. ¡Bienvenido al equipo de M4G!

### Qué puedes hacer como desarrollador

- Publicar y gestionar tus juegos en la plataforma.
- Consultar estadísticas detalladas de partidas y jugadores únicos.
- Recibir reportes de errores directamente de los usuarios.
- Actualizar la versión y los metadatos de tu juego en cualquier momento.
- Acceder a documentación técnica exclusiva para integraciones avanzadas.

### Responsabilidades

Como desarrollador verificado te comprometes a mantener tus juegos operativos, a seguir los estándares de calidad de M4G y a respetar la política de contenido de la plataforma. El incumplimiento reiterado puede resultar en la suspensión del rol.

> [!NOTE]
> Para dudas técnicas o incidencias urgentes, contacta con el equipo a través de la sección **Contacto** del portal o abre un ticket de soporte desde la página de **Ayuda**.
`,
  },

  {
    id: 'ciclo-vida',
    title: 'Ciclo de vida de un juego',
    description: 'Entiende los estados por los que pasa un juego desde que lo envías hasta que está disponible para los jugadores, y qué ocurre en cada transición.',
    content: `
Cada juego en M4G pasa por un ciclo de estados gestionado por el equipo de administración. Conocer este ciclo te ayudará a saber qué esperar en cada momento.

### Estados disponibles

> [!WARNING]
> **En revisión** — El juego ha sido enviado y está siendo evaluado por el equipo de M4G. Este proceso puede tardar entre 2 y 5 días laborables. No es posible modificar los datos durante esta fase.

> [!IMPORTANT]
> **Activo** — El juego ha superado la revisión y está disponible para todos los jugadores. Aparece en el catálogo y los jugadores pueden puntuar y reportar incidencias.

> [!CAUTION]
> **Rechazado** — El juego no cumplió los estándares de M4G. Recibirás una notificación con el motivo. Puedes corregir los problemas y enviar una nueva versión desde el panel.

> [!NOTE]
> **Inactivo** — El juego está temporalmente desactivado, ya sea a petición del desarrollador o por decisión administrativa. No aparece en el catálogo público pero sus datos se conservan.

### Flujo de transiciones

1. El desarrollador publica el juego → estado: **En revisión**.
2. El equipo aprueba → estado: **Activo**. El juego aparece en el catálogo.
3. El equipo rechaza → estado: **Rechazado**. Se notifica el motivo.
4. El desarrollador corrige y reenvía → vuelve a **En revisión**.
5. El desarrollador solicita desactivarlo → estado: **Inactivo**.

> [!TIP]
> Revisa la checklist de requisitos técnicos y de diseño antes de enviar tu juego. Los rechazos más frecuentes son por thumbnail en baja resolución, URL sin HTTPS o descripción incompleta.
`,
  },

  {
    id: 'integracion-tecnica',
    title: 'Integración técnica: cómo se carga tu juego',
    description: 'M4G carga los juegos mediante un iframe apuntando a la URL que proporcionas. Aprende los requisitos técnicos mínimos y cómo comunicarte con la plataforma.',
    content: `
La plataforma M4G utiliza un **iframe** para incrustar tu juego directamente en la página de gameplay. Tu juego debe estar desplegado en una URL pública accesible y debe responder correctamente dentro de dicho iframe.

> [!CAUTION]
> La URL de tu juego (\`game_url\`) **debe usar HTTPS**. Las URLs con HTTP son rechazadas por motivos de seguridad del navegador.

### Cabeceras HTTP requeridas

Tu servidor debe permitir que el juego sea embebido en un iframe desde el dominio de M4G. Configura las siguientes cabeceras:

\`\`\`http
# Opción A: permitir solo M4G (recomendado)
Content-Security-Policy: frame-ancestors 'self' https://made4gamers.com

# Opción B: permitir cualquier origen (solo para desarrollo)
X-Frame-Options: ALLOWALL
\`\`\`

### Estructura mínima recomendada

\`\`\`html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi Juego M4G</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { width: 100%; height: 100vh; overflow: hidden; }
      canvas { display: block; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <canvas id="game-canvas"></canvas>
    <script src="game.js"></script>
  </body>
</html>
\`\`\`

> [!NOTE]
> El iframe de M4G ocupa el 100% del ancho disponible en pantallas grandes y se adapta en móvil. Diseña tu juego para que funcione en un mínimo de **320px** de ancho.

### Campos del juego en la plataforma

\`\`\`typescript
type Game = {
  id: string;           // UUID generado por M4G
  developer_id: string; // Tu ID de usuario en la plataforma
  title: string;        // Nombre del juego (max. 60 caracteres)
  slug: string;         // URL amigable (generada automáticamente)
  description: string;  // Descripción pública (max. 500 caracteres)
  thumbnail_url: string; // URL de la imagen de portada
  game_url: string;     // URL donde está desplegado tu juego (HTTPS)
  manual_url?: string;  // URL a las reglas en formato .md (opcional)
  status: string;       // 'revision' | 'activo' | 'rechazado' | 'inactivo'
  version: string;      // Ej: "1.0.3" (semver recomendado)
  genre: string;        // Categoría del juego
  available_modes: string[]; // Ej: ["Singleplayer", "Multijugador"]
  edad_minima: number;  // Edad mínima recomendada (0 = sin restricción)
  price: number;        // Precio en euros (0 = gratuito)
};
\`\`\`
`,
  },

  {
    id: 'sistema-puntuaciones',
    title: 'Sistema de puntuaciones',
    description: 'Aprende cómo M4G registra las puntuaciones de los jugadores y cómo tu juego debe comunicarse con la plataforma para enviar scores correctamente.',
    content: `
M4G utiliza un sistema de **postMessage** para que tu juego, que corre dentro de un iframe, pueda comunicar la puntuación de cada partida a la plataforma sin necesidad de acceso directo a la base de datos.

### Cómo enviar una puntuación

Cuando el jugador termina una partida (o en cualquier punto en que quieras registrar un score), envía un mensaje al padre del iframe usando \`window.parent.postMessage\`:

\`\`\`javascript
// Llama a esta función al finalizar cada partida
function submitScore(points) {
  window.parent.postMessage(
    {
      type: 'M4G_SCORE',
      payload: {
        score: points, // número entero, mayor = mejor
      },
    },
    '*' // o el origen exacto de M4G en producción
  );
}

// Ejemplo de uso al final del juego
function onGameOver() {
  const finalScore = calculateFinalScore();
  submitScore(finalScore);
  showGameOverScreen();
}
\`\`\`

> [!WARNING]
> M4G guarda múltiples intentos por partida, pero el ranking muestra únicamente la **puntuación máxima** de cada jugador en cada juego. Asegúrate de que tu sistema de puntuación premia la habilidad acumulativa.

### Validación de puntuaciones

Para evitar rechazos o anomalías ten en cuenta estas reglas:

- El score debe ser un **número entero positivo**.
- No envíes scores de 0 a menos que el jugador realmente haya obtenido 0 puntos.
- Evita enviar múltiples mensajes de score en la misma partida; espera al game over.
- No uses valores flotantes (decimales); redondea siempre hacia abajo.

\`\`\`javascript
function submitScore(rawScore) {
  const score = Math.max(0, Math.floor(rawScore));

  if (!Number.isFinite(score)) {
    console.warn('[M4G] Score inválido, no se enviará:', rawScore);
    return;
  }

  window.parent.postMessage({ type: 'M4G_SCORE', payload: { score } }, '*');
}
\`\`\`
`,
  },

  {
    id: 'assets-diseno',
    title: 'Assets y requisitos de diseño',
    description: 'Especificaciones de la imagen de portada, descripción, géneros disponibles y otros metadatos que tu juego debe incluir para ser aprobado.',
    content: `
### Paleta de colores oficial

Usa siempre estos tokens de color para mantener coherencia visual con la plataforma. Pasa el cursor sobre cualquier muestra para ver el valor hex.

<div class="m4g-palette"></div>

| Escala | Uso principal |
|--------|---------------|
| **Slate** | Fondos, bordes, textos secundarios |
| **Violet** | Acento primario, botones, highlights del portal dev |
| **Indigo** | Acento secundario, portal de administración |
| **Emerald** | Estados de éxito, juegos activos |
| **Amber** | Avisos, estados en revisión |
| **Rose** | Errores, estados rechazados |

### Imagen de portada (thumbnail)

> [!NOTE]
> **Especificaciones técnicas:** Formato JPG, PNG o WebP. Resolución mínima: **800×600 px**. Relación de aspecto recomendada: 4:3. Tamaño máximo: **2 MB**. La imagen debe representar claramente el juego y no contener texto superpuesto excesivo.

- Usa una captura real del juego o una ilustración de alta calidad.
- Evita bordes, marcos o watermarks de terceros.
- El fondo no debe ser negro puro ni blanco puro.
- La imagen debe verse bien tanto en miniatura (80×80 px) como a tamaño completo.

### Descripción del juego

La descripción es lo primero que un jugador leerá antes de entrar. Debe ser clara, atractiva y sin errores ortográficos.

| Campo | Mínimo | Máximo |
|-------|--------|--------|
| Longitud | 50 caracteres | 500 caracteres |

> [!TIP]
> **Estructura recomendada:** Primera frase: qué es el juego. Segunda frase: cómo se juega. Tercera frase: qué lo hace especial. Ejemplo: *"Un plataformero de precisión ambientado en el espacio. Evita obstáculos y recoge estrellas usando los cursores o WASD. Incluye 20 niveles con dificultad progresiva y tabla de récords."*

### Géneros disponibles

Acción · Aventura · Puzzle · Plataformas · Arcade · Estrategia · Rol (RPG) · Simulación · Deportes · Multijugador · Educativo · Otro

### Modos de juego disponibles

\`\`\`typescript
const MODOS_VALIDOS = [
  'Singleplayer',    // Un jugador
  'Multijugador',    // Varios jugadores en el mismo dispositivo
  'Online',          // Multijugador en red
  'Cooperativo',     // Modo cooperativo
  'Competitivo',     // Modo versus
];
\`\`\`

> [!WARNING]
> Debes indicar al menos un modo de juego. Si tu juego no encaja en ninguna categoría, usa **Singleplayer** por defecto.

### Documento de reglas

Las reglas del juego deben subirse en formato **Markdown (\`.md\`)**. Puedes incluir texto, listas, tablas, bloques de código e imágenes con sintaxis estándar de Markdown.

\`\`\`markdown
# Reglas de Mi Juego

## Objetivo
Alcanza la máxima puntuación antes de que el tiempo se agote.

## Controles
- **Flechas / WASD** — Mover al personaje
- **Espacio** — Saltar
- **P** — Pausar

## Sistema de puntuación
| Acción | Puntos |
|--------|--------|
| Recoger moneda | +10 |
| Eliminar enemigo | +50 |
| Completar nivel | +500 |
\`\`\`
`,
  },

  {
    id: 'buenas-practicas',
    title: 'Buenas prácticas de desarrollo',
    description: 'Recomendaciones de rendimiento, accesibilidad y compatibilidad para que tu juego ofrezca la mejor experiencia posible a todos los jugadores de M4G.',
    content: `
### Rendimiento

- Apunta a un framerate estable de **60 fps**. Evita bucles de game loop sin límite de FPS.
- Optimiza el tamaño de tus assets: comprime texturas y sprites antes de desplegarlos.
- Usa lazy loading para recursos que no son necesarios al inicio del juego.
- El tiempo de carga inicial no debe superar los **5 segundos** en una conexión estándar.

\`\`\`javascript
const TARGET_FPS = 60;
const FRAME_DURATION = 1000 / TARGET_FPS;
let lastTime = 0;

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  if (delta >= FRAME_DURATION) {
    lastTime = timestamp - (delta % FRAME_DURATION);
    update(delta);
    render();
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
\`\`\`

### Compatibilidad

> [!NOTE]
> Tu juego debe funcionar correctamente en las dos últimas versiones de **Chrome**, **Firefox**, **Safari** y **Edge**. Prueba siempre en móvil antes de enviar a revisión.

- No uses APIs experimentales sin polyfill.
- Verifica que el juego funciona con teclado Y con pantalla táctil si aplica.
- Evita pop-ups, redirecciones externas y ventanas emergentes.

### Prueba local antes de enviar

\`\`\`html
<!DOCTYPE html>
<html lang="es">
  <head>
    <style>
      body { margin: 0; background: #0f172a; }
      iframe { display: block; width: 100%; height: 100vh; border: none; }
    </style>
  </head>
  <body>
    <!-- Reemplaza con tu game_url real -->
    <iframe src="https://tu-juego.com/index.html"></iframe>
  </body>
</html>
\`\`\`

### Accesibilidad básica

- Incluye una pantalla de controles o tutorial al inicio.
- El texto en pantalla debe tener un contraste mínimo de **4.5:1**.
- Ofrece una opción para pausar el juego en cualquier momento.
- Evita efectos de parpadeo rápido (riesgo para usuarios fotosensibles).

> [!TIP]
> Abre tu juego directamente desde la \`game_url\` en modo incógnito, sin sesión activa, y comprueba que carga y funciona sin errores en consola. Después pruébalo dentro de un iframe en localhost para simular el entorno de M4G.
`,
  },

  {
    id: 'politica-contenido',
    title: 'Política de contenido',
    description: 'Normas sobre qué tipo de contenido está permitido en M4G. El incumplimiento puede resultar en el rechazo del juego o la revocación del rol de desarrollador.',
    content: `
> [!CAUTION]
> Está **estrictamente prohibido** publicar contenido violento explícito, sexual, discriminatorio, que incite al odio, que vulnere derechos de autor de terceros o que promueva conductas ilegales. El incumplimiento resulta en baja inmediata del programa.

### Contenido permitido

- Violencia caricaturesca o abstracta (sin gore realista).
- Humor y sátira siempre que no sea discriminatoria.
- Temáticas de terror suave (suspense, puzzles de misterio).
- Contenido competitivo con tablas de récords.
- Assets con licencia libre (Creative Commons, dominio público, creados por ti).

### Propiedad intelectual

Al subir un juego a M4G declaras que tienes los derechos necesarios sobre todos sus componentes: código, gráficos, sonidos y música. M4G no se hace responsable de reclamaciones de terceros por infracciones de copyright.

> [!NOTE]
> Puedes usar assets de sitios como **itch.io** (sección assets), **OpenGameArt.org**, **Kenney.nl** o **Freesound.org**. Asegúrate de leer y cumplir la licencia específica de cada asset que utilices.

### Proceso de revisión de contenido

1. El equipo de M4G revisa el juego antes de activarlo.
2. Si se detectan problemas, el juego pasa a estado **Rechazado** con un informe.
3. Puedes corregir el contenido y solicitar una nueva revisión.
4. Tres rechazos por el mismo motivo pueden resultar en la **suspensión del rol Dev**.
`,
  },

  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    description: 'Respuestas a las dudas más comunes sobre publicación, estadísticas, actualizaciones y soporte técnico.',
    content: `
### ¿Cómo actualizo la versión de mi juego?

Desde el portal de desarrollador, accede a **Mis juegos** y pulsa **Editar** en el juego que quieras actualizar. Puedes cambiar la versión, la descripción, la URL y subir nuevos assets directamente desde el formulario.

### ¿Por qué mi juego muestra pantalla en blanco?

> [!WARNING]
> Las causas más frecuentes son: (1) la URL no usa HTTPS, (2) las cabeceras \`Content-Security-Policy\` bloquean el iframe, (3) hay errores JavaScript en la consola, (4) el servidor devuelve status distinto de 200.

### ¿Puedo tener más de un juego en la plataforma?

Sí. No hay límite de juegos por desarrollador. Cada juego pasa por su propio proceso de revisión de forma independiente.

### ¿Las estadísticas se actualizan en tiempo real?

Las estadísticas del panel (partidas totales, jugadores únicos) se calculan en el momento en que accedes a la sección. Puede haber una latencia de unos segundos dependiendo del tráfico.

### ¿Qué pasa si un jugador reporta un error en mi juego?

Los reportes llegan al equipo de M4G, que los filtra y te los hace llegar agrupados. Si el error es crítico (el juego no carga o es injugable), el equipo puede desactivar temporalmente el juego hasta que lo corrijas.

### ¿Puedo solicitar que retiren mi juego de la plataforma?

Sí. Puedes solicitar la desactivación en cualquier momento contactando con el equipo. Los datos de puntuaciones históricas se conservan pero el juego deja de aparecer en el catálogo.

> [!TIP]
> Si tienes una duda que no aparece aquí, escríbenos a través del formulario de **Contacto** del portal o abre un ticket de soporte en la sección de **Ayuda**. Respondemos en menos de 48 horas laborables.
`,
  },
];
