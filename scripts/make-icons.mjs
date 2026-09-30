// Genera los iconos de la PWA a partir de los SVG de assets/ (la «p» ya está convertida
// a trazado, así que no dependen de ninguna fuente). Usa sips, incluido en macOS.
// Uso: npm run icons
import { execFileSync } from 'node:child_process'
import { copyFileSync } from 'node:fs'

const ICONOS = [
  ['assets/logo.svg', 'icon-192.png', 192],
  ['assets/logo.svg', 'icon-512.png', 512],
  ['assets/logo-maskable.svg', 'icon-maskable-512.png', 512],
  ['assets/logo-cuadrado.svg', 'apple-touch-icon.png', 180], // iOS redondea las esquinas por su cuenta
]

for (const [fuente, destino, tamano] of ICONOS) {
  execFileSync('sips', ['-s', 'format', 'png', '-z', String(tamano), String(tamano), fuente, '--out', `public/icons/${destino}`], {
    stdio: 'ignore',
  })
}
copyFileSync('assets/logo.svg', 'public/icons/icon.svg')
console.log('Iconos generados en public/icons')
