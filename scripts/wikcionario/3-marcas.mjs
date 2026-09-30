// Paso 3: segunda pasada por el volcado → marcas.json (homógrafos, varias etimologías, usos vulgares…).
import { createInterface } from 'node:readline'
import { readFileSync, writeFileSync } from 'node:fs'
const interes = new Set(JSON.parse(readFileSync('candidatas.json', 'utf8')).map((e) => e.w))
const info = Object.create(null)
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
for await (const linea of rl) {
  let e
  try { e = JSON.parse(linea) } catch { continue }
  if (e.lang_code !== 'es' || !interes.has(e.word)) continue
  const i = (info[e.word] ??= { formaDe: false, nombre: false, etimologias: [], marcas: [] })
  if (e.pos === 'name') i.nombre = true
  for (const s of e.senses ?? []) {
    if (s.form_of || s.alt_of || (s.tags ?? []).includes('form-of')) i.formaDe = true
    for (const t of s.tags ?? []) if (/vulgar|offensive|derogatory|slur|pejorative|obscene|slang|ethnic|rare|obsolete|archaic|dated/.test(t)) i.marcas.push(t)
  }
  const ety = (e.etymology_text ?? '').split('\n').at(-1).slice(0, 80)
  if (ety && !i.etimologias.includes(ety)) i.etimologias.push(ety)
}
writeFileSync('marcas.json', JSON.stringify(info))
console.log(Object.keys(info).length, 'palabras con información')
