import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

/** Genera sw.js con la lista de ficheros de la build para que el juego funcione sin conexión. */
function serviceWorker(): Plugin {
  return {
    name: 'periplo-sw',
    apply: 'build',
    generateBundle(_, bundle) {
      const publicos = ['manifest.webmanifest', ...readdirSync('public/icons').map((f) => `icons/${f}`)]
      const ficheros = ['./', ...Object.keys(bundle).filter((f) => f !== 'index.html'), ...publicos]
      const version = createHash('sha256').update(ficheros.join()).digest('hex').slice(0, 10)
      const fuente = readFileSync('sw.js', 'utf8')
        .replace('__PRECACHE__', JSON.stringify(ficheros))
        .replace('__VERSION__', JSON.stringify(version))
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: fuente })
    },
  }
}

/** Inserta el logo en la portada del HTML para que se vea antes de que cargue el JavaScript. */
function portada(): Plugin {
  return {
    name: 'periplo-portada',
    transformIndexHtml: (html) => html.replace('<!-- logo -->', readFileSync('assets/logo.svg', 'utf8').trim()),
  }
}

export default defineConfig({
  // Rutas relativas: funciona igual en la raíz de un dominio que en GitHub Pages (/Periplo/).
  base: './',
  plugins: [portada(), serviceWorker()],
})
