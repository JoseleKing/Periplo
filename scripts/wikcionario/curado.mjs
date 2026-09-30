// Decisiones de revisión manual sobre las candidatas de Wikcionario.
// Francés, italiano e inglés: solo palabras formadas en esa lengua y asimiladas (el DLE también se detiene ahí).
export const SOLO = {
  francés: 'papá bebé control hotel tren sorpresa departamento restaurante camión autobús pastel paquete chaqueta cobarde moda personaje atrapar chef botón garaje tarta billete batería maquillaje pasaporte rutina cabina taller'.split(' '),
  italiano: 'pista apartamento empresa manejar modelo favorito piloto pizza tráfico ducha atacar asalto aguantar diseño novela casino retrato mercancía canalla charlar escopeta violín escolta trío brillar carnaval bancarrota acampar'.split(' '),
  inglés: 'detective club líder internet ron golf jersey béisbol estrés fan motel rifle sándwich radar chip test bingo jazz hockey récord láser film bate revólver pub jet gol software bar show rock web kit flash'.split(' '),
}
// Excluidas en la revisión: homógrafos, vulgarismos o despectivos, duplicados, nombres propios,
// palabras que delatan la respuesta, demasiado raras o con cadena mal extraída o truncada.
export const EXCLUIDAS = new Set(`
matar ante zorra tara lima fulano tell cid carmen roque jeta henna djinn yihad albacea alcahuete cholo chichi chan nance chili sakura kabuki yen
sensei golem judaísmo molotov rasputín knut portugués catalán turco árabe hindi hindú azteca basta toca marco tapa brote runa trol troll bluetooth
chambelán traje tacho tapioca quilombo papel prensa correo lisa trozo pote nano petar trullo fame agote toco paco combo chupe opa carpa cancha chilla
lola nuño quique puto chelo cigarro remolacha flauta perfil aspirina land dixie kiosco soya izquierdo esquí gen criminalística hamster propano chita
ario esvástica mantra chakra ramen mahjong yuan zafar falafel emir cábala kosher bagel morsa safari hachís gasa roque alcántara bey
fez tulipán mazorca almirante cero tabique ajuar monzón avería soja escaparate bulevar potasio flamenco iceberg dique lotería
droga birra káiser nazi embajada caricatura follaje farándula alojar caparazón gabinete jornada desastre rima jamás clavel riel crisol añoranza
forastero linaje fango chuleta barraca grava cantimplora picaporte galpón cuate hule peyote corpiño ría butaca zarigüeya kimchi mucama bambú volcán
ponche champán ketchup este sus van gay inglés norte sur video vídeo sheriff bote lord lady miss man comité cheque whisky gasolina túnel dólar junior
house green baby shock tenis hall clan teme pop top boom set milord out chad hurra cool like brandy estándar down crack post ring mierda maldito
mermelada tanque samba barullo baranda favela cromosoma lila pato patata loro poncho bandeja bandido flan dardo brecha boya
`.trim().split(/\s+/))

// Sustantivos que también son formas de un verbo derivado de ellos mismos (aceite → aceitar): mismo origen.
export const FORMA_REVISADA = new Set('asesino aceite alfombra alguacil algodón mezquino azote joroba aceituna tabique alfalfa'.split(' '))

// Revisión de griego y latín: palabras gramaticales, formas verbales, homógrafos, gentilicios, letras,
// derivados casi duplicados, temas poco adecuados para un juego casual y cadenas mal extraídas.
export const EXCLUIDAS_2 = new Set(`
qué una pero bien como más muy así vamos algo cuando cómo vez soy eres tan sobre dijo tal después sido menos luego hoy aún tanto digo somos hice
contra dentro casi dijiste cuándo incluso mas ido habla ello unas atrás estaban oído acerca cual demás ambos pudo dijeron salvo detrás segundo orden
supuesto todavía quizá vista muerto estado
asqueroso tenia celoso gene polis noto corea alfa delta gamma theta tau omega sirio galileo asiático cristo drago domo duela hepática preste eros
albóndiga timbre orgasmo clítoris orgía afrodisíaco erótico sexo cannabis torácico traumatismo traumático carótida catéter edema aneurisma
esclerosis clínico arritmia ántrax tifus problemático dinámico ético melancólico histérico democrático dramático mágico mítico cósmico galáctico
terapéutico terapeuta atlético hipotético patológico meteorológico demoníaco sintético
anda juro deseo aun media apuesto intento lamento vivo vino ganar
verme ama nota bomba pedido respecto regreso
`.trim().split(/\s+/))
