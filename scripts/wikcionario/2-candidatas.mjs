// Paso 2: extrae de la prosa de Wikcionario la cadena etimológica de cada palabra frecuente → candidatas.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { LENGUAS_WIKI } from './lenguas.mjs'
const NOMBRES = Object.keys(LENGUAS_WIKI).sort((a, b) => b.length - a.length)
const DUDA = /uncertain|possibly|perhaps|probably|unknown|unclear|disputed|onomatop|imitative|obscure|dubious|may be|might be|likely|or from|or directly|is thought|conjectur|expressive|either|origin is|\?/i
const POS = new Set(['noun', 'verb', 'adj', 'adv'])
const rango = new Map()
readFileSync('datos/es_50k.txt', 'utf8').split('\n').forEach((l, i) => { const w = l.split(' ')[0]; if (w && !rango.has(w)) rango.set(w, i + 1) })

// Nombre de lengua (capitalizado, posiblemente varias palabras) tras from/via/borrowed…
const LANG = /^(?:an? |the )?((?:Proto-|Old |Middle |Late |Early |Vulgar |Medieval |Classical |Ancient |Modern |New |Ecclesiastical |Koine |Byzantine |Biblical |Andalusian |Imperial |Classical )*[A-Z][\p{L}-]+(?: [A-Z][\p{L}-]+){0,2})/u

const ALTERNATIVA = new RegExp(`\\b(${NOMBRES.join('|')}) or (${NOMBRES.join('|')})\\b`, 'g')

/** Hasta el primer punto o punto y coma fuera de paréntesis y comillas. */
function primeraFrase(texto) {
  let prof = 0
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (c === '(' || c === '“') prof++
    else if (c === ')' || c === '”') prof = Math.max(0, prof - 1)
    else if (prof === 0 && (c === ';' || (c === '.' && /\s|$/.test(texto[i + 1] ?? '')))) return texto.slice(0, i)
  }
  return texto
}

/** Texto de la forma y su paréntesis, hasta la siguiente coma o conector fuera de paréntesis. */
function segmento(texto) {
  let prof = 0
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (c === '(') prof++
    else if (c === ')') prof = Math.max(0, prof - 1)
    else if (prof === 0) {
      if (c === ',' || c === ';' || (c === '.' && (texto[i + 1] ?? ' ') === ' ')) return texto.slice(0, i)
      if (/^ (via|from|borrowed|through|itself|ultimately|in turn|which|and|or) /.test(texto.slice(i))) return texto.slice(0, i)
    }
  }
  return texto
}

export function parsear(prosa) {
  let frase = prosa.replace(/\s*\((?:cf\.|compare|see)[^)]*\)/gi, '')
  frase = primeraFrase(frase).replace(/^Like [^.]*?,\s*(?=(?:Borrowed|Inherited|From|Learned|Semi-learned|Derived)\b)/, '')
  frase = frase.replace(ALTERNATIVA, '$2')
  frase = frase.split(/,?\s(?:cognate|compare|doublet|related|equivalent|akin|see |whence|more at|ultimately cognate)/i)[0]
  if (DUDA.test(frase)) return { error: 'dudosa' }
  if (/\s\+\s/.test(frase)) return { error: 'compuesto' }
  const pasos = []
  const re = /(inherited|borrowed|derived|learned borrowing|semi-learned borrowing|orthographic borrowing|unadapted borrowing|calque|from|via|through)\s+(?:from\s+)?/gi
  let m, primero = true, ultimoSinForma = false
  const hallados = []
  while ((m = re.exec(frase))) hallados.push({ tipo: m[1].toLowerCase(), idx: m.index + m[0].length, inicio: m.index })
  if (!hallados.length) return { error: 'sin cadena' }
  if (hallados[0].inicio > 2) return { error: 'no empieza por la cadena' }
  for (const h of hallados) {
    if (h.tipo === 'calque') return { error: 'calco' }
    const resto = frase.slice(h.idx)
    const l = resto.match(LANG)
    if (!l) { if (primero) return { error: 'interno' }; continue }
    let nombre = NOMBRES.find((n) => l[1] === n || l[1].startsWith(n + ' '))
    if (!nombre) {
      if (/^Proto-/.test(l[1]) || /^(Pre-|Pre-Roman|Pre-Indo|Indo-European|Germanic|Semitic|Celtic|Italic)/.test(l[1])) break
      if (primero && /^[a-záéíóúñ]/.test(resto)) return { error: 'interno' }
      return { error: 'lengua desconocida', nombre: l[1] }
    }
    primero = false
    const tras = resto.slice(l[0].length - (l[1].length - nombre.length)).trimStart()
    const cat = LENGUAS_WIKI[nombre]
    if (cat === null) continue
    const cuerpo = segmento(tras)
    const pm = cuerpo.match(/^([^(]*?)\s*(?:\((.*)\))?\s*$/)
    let forma = (pm?.[1] ?? '').trim()
    if (/ or /.test(forma) || /^or /.test(tras.slice(cuerpo.length).trimStart())) return { error: 'dudosa' }
    if (forma.split(' ').length > 4) forma = ''
    const par = pm?.[2] ?? ''
    const glosa = par.match(/“([^”]*)”/)?.[1]
    const translit = par.replace(/“[^”]*”/g, '').split(',').map((s) => s.trim()).filter(Boolean)[0]
    if (!forma || /^(and|or|of|in|with|a|the|-)$/.test(forma)) { if (h.tipo !== 'via') ultimoSinForma = true; continue }
    ultimoSinForma = false
    const paso = { lengua: cat[0], variante: cat[1], nombre, forma, translit, glosa }
    if (h.tipo === 'via' && pasos.length) pasos.splice(pasos.length - 1, 0, paso)
    else pasos.push(paso)
  }
  if (ultimoSinForma) return { error: 'origen sin forma' }
  if (!pasos.length) return { error: 'sin pasos' }
  return { pasos }
}

const motivos = new Map(), desconocidas = new Map(), origenes = new Map(), cand = []
const suma = (m, k) => m.set(k, (m.get(k) ?? 0) + 1)
const vistos = new Set()
for (const l of readFileSync('datos/etimologias.jsonl', 'utf8').split('\n')) {
  if (!l) continue
  const e = JSON.parse(l)
  const r = rango.get(e.w)
  if (!r || !POS.has(e.pos) || vistos.has(e.w) || !/^[a-zñáéíóúü]{3,}$/.test(e.w)) continue
  vistos.add(e.w)
  const prosa = (e.t ?? '').split('\n').at(-1)
  const res = parsear(prosa)
  if (res.error) { suma(motivos, res.error); if (res.nombre) suma(desconocidas, res.nombre); continue }
  const origen = res.pasos.at(-1).lengua
  suma(origenes, origen)
  cand.push({ w: e.w, r, pos: e.pos, pasos: res.pasos.reverse(), prosa, glosa: e.g })
}
console.log('candidatas', cand.length, Object.fromEntries(motivos))
console.log('ORÍGENES', [...origenes].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join('  '))
console.log('DESCONOCIDAS', [...desconocidas].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => `${k}:${v}`).join('  '))
writeFileSync('candidatas.json', JSON.stringify(cand))
