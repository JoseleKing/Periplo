// Paso 4: aplica los filtros y la revisión manual (curado.mjs) y elige el reparto por origen → elegidas.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { SOLO, EXCLUIDAS, EXCLUIDAS_2, FORMA_REVISADA } from './curado.mjs'
const cand = JSON.parse(readFileSync('candidatas.json', 'utf8'))
const marcas = JSON.parse(readFileSync('marcas.json', 'utf8'))
const PROPIAS = new Set(['almohada', 'chocolate', 'cancha', 'tomate', 'guitarra', 'periplo', 'jardín', 'ajedrez', 'escuela', 'huracán', 'guerra', 'robot', 'mesa', 'álgebra', 'pampa', 'naranja', 'ojalá', 'bodega', 'aguacate', 'hablar', 'tabú', 'cóndor', 'filosofía', 'alcohol', 'chicle', 'fútbol', 'tiza'])
const LATINA = /^[\p{Script=Latin}\p{M}*'ʼ’\-. ]+$/u
const GRIEGA = /^[\p{Script=Greek}\p{M}\s*]+$/u
const MALAS = /vulgar|offensive|derogatory|slur|pejorative|obscene|ethnic/
const OBJETIVO = 876 // 900 menos las 24 palabras propias de src/palabras.ts

function mostrar(p) {
  if (LATINA.test(p.forma)) return p.forma
  if (!p.translit || !LATINA.test(p.translit)) return null
  return GRIEGA.test(p.forma) ? `${p.forma} (${p.translit})` : p.translit
}

const motivo = new Map(); const m = (k) => motivo.set(k, (motivo.get(k) ?? 0) + 1)
const validas = []
for (const c of cand) {
  if (PROPIAS.has(c.w) || EXCLUIDAS.has(c.w) || EXCLUIDAS_2.has(c.w)) { m('propia o excluida'); continue }
  if (c.pos === 'verb' && !/(ar|er|ir|ír)$/.test(c.w)) { m('forma verbal'); continue }
  const info = marcas[c.w]
  const pasos = []
  let ok = true
  c.pasos.forEach((p, i) => {
    const forma = mostrar(p)
    const limpia = forma?.replace(/\s+(m|f|n|m pl|f pl|n pl|with)$/, '').trim()
    if (!limpia || /^-|-$/.test(limpia) || / (with|and|of|expression) /.test(' ' + limpia + ' ')) { if (i === 0) ok = false; return }
    if (pasos.some((q) => q.forma === limpia)) { ok = false; return }
    pasos.push({ lengua: p.lengua, variante: p.variante, forma: limpia, glosa: p.glosa })
  })
  if (!ok || !pasos.length) { m('forma no mostrable'); continue }
  const origen = pasos[0].lengua
  if (SOLO[origen] && !SOLO[origen].includes(c.w)) { m('romance/inglés no revisada'); continue }
  if (['catalán', 'occitano', 'portugués', 'gallego', 'asturleonés', 'mozárabe', 'aragonés', 'rumano', 'sardo', 'judeoespañol'].includes(origen)) { m('origen romance'); continue }
  if (!info) { m('sin información'); continue }
  if (info.etimologias.filter((t) => !t.startsWith('See the etymology')).length > 1) { m('varias etimologías'); continue }
  if (info.formaDe && !FORMA_REVISADA.has(c.w) && origen !== 'latín' && origen !== 'griego') { m('forma de otra palabra'); continue }
  if (info.marcas.some((t) => MALAS.test(t))) { m('malsonante'); continue }
  validas.push({ w: c.w, r: c.r, origen, pasos })
}
const por = new Map()
for (const v of validas) (por.get(v.origen) ?? por.set(v.origen, []).get(v.origen)).push(v)
for (const l of por.values()) l.sort((a, b) => a.r - b.r)
// Todas las de orígenes minoritarios y revisados; el resto del cupo, latín y griego por frecuencia (60/40).
const fijas = [...por].filter(([k]) => k !== 'latín' && k !== 'griego').flatMap(([, l]) => l)
const hueco = OBJETIVO - fijas.length
const nGriego = Math.min(por.get("griego").length, Math.round(hueco * 0.5))
const elegidas = [...fijas, ...por.get('griego').slice(0, nGriego), ...por.get('latín').slice(0, hueco - nGriego)]
console.log('descartes', Object.fromEntries(motivo))
console.log('elegidas', elegidas.length, '| fijas', fijas.length, '| griego', nGriego, '| latín', hueco - nGriego)
const cuenta = new Map(); for (const e of elegidas) cuenta.set(e.origen, (cuenta.get(e.origen) ?? 0) + 1)
console.log([...cuenta].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join('  '))
console.log('rango máx latín', por.get('latín')[hueco - nGriego - 1].r, 'griego', por.get('griego')[nGriego - 1].r)
writeFileSync('elegidas.json', JSON.stringify(elegidas, null, 1))
