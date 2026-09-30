// Paso 1: lee el volcado JSONL de kaikki.org por la entrada estándar y deja solo palabra, categoría y etimología.
import { createInterface } from 'node:readline'
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
let n = 0, k = 0
for await (const linea of rl) {
  n++
  if (!linea.includes('"etymology_templates"')) continue
  try {
    const e = JSON.parse(linea)
    if (e.lang_code !== 'es' || !e.etymology_templates?.length) continue
    k++
    process.stdout.write(JSON.stringify({ w: e.word, pos: e.pos, t: e.etymology_text, tpl: e.etymology_templates.map((x) => ({ n: x.name, a: x.args, x: x.expansion })), g: e.senses?.[0]?.glosses?.[0] }) + '\n')
  } catch {}
}
process.stderr.write(`leídas ${n}, guardadas ${k}\n`)
