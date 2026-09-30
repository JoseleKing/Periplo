// Cada palabra lleva su cadena etimológica ordenada de la forma más antigua a la
// más reciente (sin incluir el español). El origen último es siempre el primer paso.
//
// Las primeras palabras (PROPIAS) están escritas a mano, con referencia al DLE (RAE).
// El resto (palabras-wikcionario.json) se extrajo del Wikcionario en inglés, vía kaikki.org,
// con revisión manual; esos datos se distribuyen bajo licencia CC BY-SA 4.0.
// Ver scripts/wikcionario/ para regenerarlos.

import WIKCIONARIO from './palabras-wikcionario.json'

/** Nombre de la lengua en español (griego, latín, árabe…). */
export type Lengua = string

export interface Paso {
  lengua: Lengua
  /** Nombre más preciso que se muestra en la cadena (p. ej. «árabe hispánico»). */
  variante?: string
  forma: string
  significado?: string
}

export interface Palabra {
  palabra: string
  cadena: Paso[]
  nota?: string
}

const PROPIAS: Palabra[] = [
  {
    palabra: 'periplo',
    cadena: [
      { lengua: 'griego', forma: 'περίπλους (períplous)', significado: 'navegación alrededor' },
      { lengua: 'latín', forma: 'periplus' },
    ],
    nota: 'Formada por perí «alrededor» y ploûs «navegación».',
  },
  {
    palabra: 'jardín',
    cadena: [
      { lengua: 'germánico', variante: 'fráncico', forma: '*gard', significado: 'cercado' },
      { lengua: 'francés', forma: 'jardin' },
    ],
    nota: 'Un jardín era, en origen, un terreno cercado.',
  },
  {
    palabra: 'tomate',
    cadena: [{ lengua: 'náhuatl', forma: 'tomatl' }],
  },
  {
    palabra: 'guitarra',
    cadena: [
      { lengua: 'griego', forma: 'κιθάρα (kithára)', significado: 'cítara' },
      { lengua: 'árabe', variante: 'árabe hispánico', forma: 'qítara' },
    ],
    nota: 'El instrumento griego llegó al castellano a través del árabe.',
  },
  {
    palabra: 'ajedrez',
    cadena: [
      { lengua: 'sánscrito', forma: 'caturaṅga', significado: 'de cuatro miembros' },
      { lengua: 'persa', variante: 'persa medio (pahlaví)', forma: 'čatrang' },
      { lengua: 'árabe', variante: 'árabe clásico', forma: 'šiṭranǧ' },
      { lengua: 'árabe', variante: 'árabe hispánico', forma: 'aššaṭranǧ' },
    ],
    nota: 'Los cuatro miembros del ejército indio: infantería, caballería, elefantes y carros.',
  },
  {
    palabra: 'escuela',
    cadena: [
      { lengua: 'griego', forma: 'σχολή (scholḗ)', significado: 'ocio, tiempo libre' },
      { lengua: 'latín', forma: 'schola' },
    ],
    nota: 'Para los griegos, el tiempo libre era el que se dedicaba a estudiar y conversar.',
  },
  {
    palabra: 'huracán',
    cadena: [{ lengua: 'taíno', forma: 'hurakán' }],
    nota: 'Una de las primeras voces americanas que entraron en el español.',
  },
  {
    palabra: 'guerra',
    cadena: [{ lengua: 'germánico', forma: '*werra', significado: 'discordia, pelea' }],
    nota: 'Desplazó al latín bellum, que sobrevive en «bélico».',
  },
  {
    palabra: 'robot',
    cadena: [
      { lengua: 'checo', forma: 'robota', significado: 'trabajo, prestación personal' },
      { lengua: 'inglés', forma: 'robot' },
    ],
    nota: 'Acuñada por Josef Čapek para la obra R.U.R. (1920) de su hermano Karel.',
  },
  {
    palabra: 'mesa',
    cadena: [{ lengua: 'latín', forma: 'mensa' }],
  },
  {
    palabra: 'álgebra',
    cadena: [
      { lengua: 'árabe', variante: 'árabe clásico', forma: 'al-ǧabr', significado: 'la reducción' },
      { lengua: 'latín', variante: 'latín tardío', forma: 'algebra' },
    ],
    nota: 'Procede del título de un tratado de matemáticas de al-Juarismi.',
  },
  {
    palabra: 'pampa',
    cadena: [{ lengua: 'quechua', forma: 'pampa', significado: 'llanura' }],
  },
  {
    palabra: 'naranja',
    cadena: [
      { lengua: 'sánscrito', forma: 'nāraṅga' },
      { lengua: 'persa', forma: 'nārang' },
      { lengua: 'árabe', variante: 'árabe clásico', forma: 'nāranǧ' },
      { lengua: 'árabe', variante: 'árabe hispánico', forma: 'naránǧa' },
    ],
  },
  {
    palabra: 'ojalá',
    cadena: [
      { lengua: 'árabe', variante: 'árabe hispánico', forma: 'law šá lláh', significado: 'si Dios quiere' },
    ],
  },
  {
    palabra: 'bodega',
    cadena: [
      { lengua: 'griego', forma: 'ἀποθήκη (apothḗkē)', significado: 'depósito, almacén' },
      { lengua: 'latín', forma: 'apotheca' },
    ],
    nota: 'De la misma palabra griega viene también «botica».',
  },
  {
    palabra: 'aguacate',
    cadena: [{ lengua: 'náhuatl', forma: 'ahuacatl' }],
  },
  {
    palabra: 'hablar',
    cadena: [{ lengua: 'latín', forma: 'fabulari', significado: 'conversar' }],
    nota: 'La f- inicial latina se convirtió en h- en castellano: fabulari → hablar.',
  },
  {
    palabra: 'tabú',
    cadena: [
      { lengua: 'polinesio', forma: 'tabu' },
      { lengua: 'inglés', forma: 'taboo' },
    ],
    nota: 'El capitán Cook la recogió en Tonga en 1777.',
  },
  {
    palabra: 'cóndor',
    cadena: [{ lengua: 'quechua', forma: 'kúntur' }],
  },
  {
    palabra: 'filosofía',
    cadena: [
      { lengua: 'griego', forma: 'φιλοσοφία (philosophía)', significado: 'amor a la sabiduría' },
      { lengua: 'latín', forma: 'philosophia' },
    ],
  },
  {
    palabra: 'alcohol',
    cadena: [
      { lengua: 'árabe', variante: 'árabe clásico', forma: 'kuḥl' },
      { lengua: 'árabe', variante: 'árabe hispánico', forma: 'alkuḥúl', significado: 'colirio de antimonio' },
    ],
    nota: 'Primero designó un polvo fino para maquillar los ojos (el kohl).',
  },
  {
    palabra: 'chicle',
    cadena: [{ lengua: 'náhuatl', forma: 'tzictli' }],
  },
  {
    palabra: 'fútbol',
    cadena: [{ lengua: 'inglés', forma: 'football' }],
  },
  {
    palabra: 'tiza',
    cadena: [{ lengua: 'náhuatl', forma: 'tizatl' }],
  },
]

export const PALABRAS: Palabra[] = [...PROPIAS, ...(WIKCIONARIO as Palabra[])]

/** Lenguas que son origen último de alguna palabra: las respuestas posibles y los distractores. */
export const LENGUAS: Lengua[] = [...new Set(PALABRAS.map((p) => p.cadena[0].lengua))].sort((a, b) =>
  a.localeCompare(b, 'es'),
)

/**
 * Peso de cada lengua como distractor: la raíz de cuántas palabras tiene como origen. Así el latín
 * y el griego compiten entre sí, y una lengua rara entre las opciones no delata la respuesta.
 */
export const PESO_LENGUA = new Map<Lengua, number>(
  LENGUAS.map((l) => [l, Math.sqrt(PALABRAS.filter((p) => p.cadena[0].lengua === l).length)]),
)
