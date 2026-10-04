import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

function huella(...contenidos: (string | Buffer)[]): string {
  const hash = createHash('sha256')
  contenidos.forEach((c) => hash.update(c))
  return hash.digest('hex').slice(0, 10)
}

/**
 * El script de Almanaque se pide con una huella de su contenido. Así, al publicar uno nuevo,
 * el service worker anterior no lo encuentra en su caché y lo trae de la red.
 */
const VOLVER_ALMANAQUE = `volver-almanaque.js?v=${huella(readFileSync('public/volver-almanaque.js'))}`

/** Genera sw.js con la lista de ficheros de la build para que el juego funcione sin conexión. */
function serviceWorker(): Plugin {
  return {
    name: 'periplo-sw',
    apply: 'build',
    generateBundle(_, bundle) {
      const iconos = readdirSync('public/icons').map((f) => `icons/${f}`)
      const publicos = ['manifest.webmanifest', VOLVER_ALMANAQUE, ...iconos]
      const ficheros = ['./', ...Object.keys(bundle).filter((f) => f !== 'index.html'), ...publicos]
      // La versión cambia si cambia cualquier fichero de public/, aunque conserve el nombre.
      const version = huella(
        ficheros.join(),
        ...['manifest.webmanifest', ...iconos].map((f) => readFileSync(`public/${f}`)),
      )
      const fuente = readFileSync('sw.js', 'utf8')
        .replace('__PRECACHE__', JSON.stringify(ficheros))
        .replace('__VERSION__', JSON.stringify(version))
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: fuente })
    },
  }
}

/** Inserta el logo y el nombre en la portada del HTML para que se vean antes de que cargue el JavaScript. */
function portada(): Plugin {
  return {
    name: 'periplo-portada',
    transformIndexHtml: (html) =>
      html
        .replace('<!-- logo -->', readFileSync('assets/logo.svg', 'utf8').trim())
        .replace('<!-- marca -->', readFileSync('src/marca.svg', 'utf8').trim())
        .replace('src="volver-almanaque.js"', `src="${VOLVER_ALMANAQUE}"`),
  }
}

export default defineConfig({
  // Rutas relativas: funciona igual en la raíz de un dominio que en GitHub Pages (/Periplo/).
  base: './',
  plugins: [portada(), serviceWorker()],
})
