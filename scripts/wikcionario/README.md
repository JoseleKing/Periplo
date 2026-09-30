# Palabras desde Wikcionario

Scripts con los que se generó `src/palabras-wikcionario.json` (876 palabras) a partir del
Wikcionario en inglés, en su versión estructurada de [kaikki.org](https://kaikki.org/dictionary/Spanish/).
Los datos resultantes se distribuyen bajo **CC BY-SA 4.0**, como el Wikcionario.

## Criterios

- Palabras frecuentes (lista de frecuencias [FrequencyWords](https://github.com/hermitdave/FrequencyWords), top 50 000).
- La cadena se lee de la prosa etimológica («Inherited from Old Spanish X, from Latin Y, from Ancient Greek Z»):
  se omite el castellano antiguo y se corta en las protolenguas reconstruidas.
- Se descartan: etimologías dudosas (*possibly*, *uncertain*…), palabras formadas en español,
  homógrafos con varias etimologías, usos vulgares u ofensivos y lenguas no reconocidas (`lenguas.mjs`).
- Revisión manual en `curado.mjs`: listas cerradas para francés, italiano e inglés (solo palabras
  formadas en esa lengua; en el resto, la cadena de Wikcionario suele estar truncada), exclusiones
  de homógrafos, duplicados, gentilicios y cadenas mal extraídas.
- Reparto: todos los orígenes minoritarios revisados y, para completar, latín y griego a partes iguales.
- Las glosas de los étimos están traducidas a mano en `glosas.json`.

## Regenerar

Desde un directorio de trabajo fuera del repositorio (los intermedios ocupan ~80 MB):

```sh
S=/ruta/a/Periplo/scripts/wikcionario
mkdir -p datos
curl -s https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt -o datos/es_50k.txt
curl -s https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl | node $S/1-filtrar.mjs > datos/etimologias.jsonl
node $S/2-candidatas.mjs
curl -s https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl | node $S/3-marcas.mjs
node $S/4-seleccionar.mjs
node $S/5-generar.mjs /ruta/a/Periplo/src/palabras-wikcionario.json
```

El volcado de kaikki se actualiza con el Wikcionario: con una versión más reciente pueden cambiar
algunas palabras, y `5-generar.mjs` avisará si aparecen glosas nuevas sin traducir.
