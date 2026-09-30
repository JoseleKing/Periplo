// Paso 5: genera src/palabras-wikcionario.json: ordena las palabras para que cada día mezcle orígenes
// (latín, griego y otro) y traduce las glosas al español.
import { readFileSync, writeFileSync } from 'node:fs'
const elegidas = JSON.parse(readFileSync('elegidas.json', 'utf8'))
const glosas = JSON.parse(readFileSync(new URL('./glosas.json', import.meta.url), 'utf8'))

function aleatorio(semilla) {
  let a = semilla >>> 0
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const rnd = aleatorio(20260930)
const barajar = (l) => { const c = [...l]; for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] } return c }

const colas = {
  latín: barajar(elegidas.filter((e) => e.origen === 'latín')),
  griego: barajar(elegidas.filter((e) => e.origen === 'griego')),
  otras: barajar(elegidas.filter((e) => e.origen !== 'latín' && e.origen !== 'griego')),
}
// Las 24 palabras propias de src/palabras.ts ocupan los 8 primeros días.
const PROPIAS = 24
const orden = []
const total = elegidas.length
const cuota = { otras: colas.otras.length / total, latín: colas.latín.length / total, griego: colas.griego.length / total }
const usadas = { otras: 0, latín: 0, griego: 0 }
while (orden.length < total) {
  // Elige la cola más retrasada respecto a su cuota, sin repetir origen dentro del mismo día si se puede.
  const posEnDia = (PROPIAS + orden.length) % 3
  const delDia = posEnDia === 0 ? [] : orden.slice(-posEnDia).map((e) => (e.origen === 'latín' || e.origen === 'griego' ? e.origen : 'otras'))
  const candidatas = Object.keys(colas).filter((k) => colas[k].length)
  candidatas.sort((a, b) => (usadas[a] - cuota[a] * orden.length) - (usadas[b] - cuota[b] * orden.length))
  const k = candidatas.find((c) => !delDia.includes(c)) ?? candidatas[0]
  orden.push(colas[k].shift())
  usadas[k]++
}

const traducir = (g) => (g ? glosas[g] : undefined)
const datos = orden.map((e) => ({
  palabra: e.w,
  cadena: e.pasos.map((p) => {
    const paso = { lengua: p.lengua }
    if (p.variante) paso.variante = p.variante
    paso.forma = p.forma
    const s = traducir(p.glosa)
    if (s) paso.significado = s
    return paso
  }),
}))
const sinTraducir = orden.flatMap((e) => e.pasos).filter((p) => p.glosa && !glosas[p.glosa])
if (sinTraducir.length) throw new Error('Glosas sin traducir: ' + sinTraducir.length)
writeFileSync(process.argv[2], JSON.stringify(datos, null, 0).replace(/\},\{"palabra"/g, '},\n{"palabra"') + '\n')
console.log('escritas', datos.length)
