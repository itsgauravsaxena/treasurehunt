/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const staticClues = [
  {
    coords: [55.68696830796677, 12.441323778391876], // 1. Købmand the most popular one
    text: "🎮 Hvad hedder det spil, hvor man bygger med firkantede klodser og kæmper mod Creepers?",
    options: ["Minecraft", "Roblox", "Fortnite"],
    answer: "Minecraft",
    type: "options",
    hint: "Købmand den mest populære"
  },
  {
    coords: [55.68695494871787, 12.439874297646213], // 2. Ejbyvej road sign
    text: "🦁 Hvad er det hurtigste landdyr i verden?",
    options: ["Gepard", "Løve", "Hest"],
    answer: "Gepard",
    type: "options",
    hint: "Ejbyvej vejskilt"
  },
  {
    coords: [55.687032690311014, 12.438615004732753], // 3. Behind the pole ejbyvænge
    text: "🌍 Hvilken planet er kendt som 'den røde planet'?",
    options: ["Mars", "Jupiter", "Venus"],
    answer: "Mars",
    type: "options",
    hint: "Bag pælen ved Ejbyvænge"
  },
  {
    coords: [55.686960424146285, 12.437665374624837], // 4. Behind arrow sign on road
    text: "🇩🇰 Hvad hedder Danmarks hovedstad?",
    options: ["København", "Aarhus", "Odense"],
    answer: "København",
    type: "options",
    hint: "Bag pileskiltet på vejen"
  },
  {
    coords: [55.686970142729656, 12.43602611815933], // 5. 2 Little TDC boxes
    text: "🦸 Hvilken superhelt er kendt for at svinge sig mellem bygninger i New York?",
    options: ["Spider-Man", "Superman", "Batman"],
    answer: "Spider-Man",
    type: "options",
    hint: "2 små TDC-bokse"
  },
  {
    coords: [55.6869651359237, 12.435446941494142], // 6. Another TDC box
    text: "🌊 Hvad er det største hav i verden?",
    options: ["Stillehavet", "Atlanterhavet", "Det Indiske Ocean"],
    answer: "Stillehavet",
    type: "options",
    hint: "Endnu en TDC-boks"
  },
  {
    coords: [55.6875977,12.4354654], // 7. Old bunker building
    text: "📖 Hvem har skrevet bøgerne om Harry Potter?",
    options: ["J.K. Rowling", "H.C. Andersen", "Astrid Lindgren"],
    answer: "J.K. Rowling",
    type: "options",
    hint: "Gammel bunkebygning"
  },
  {
    coords: [55.6879552,12.4349564], // 8. Pillar before bridge
    text: "📱 Hvilket firma laver iPhone?",
    options: ["Apple", "Samsung", "Google"],
    answer: "Apple",
    type: "options",
    hint: "Søjle før broen"
  },
  {
    coords: [55.68807811514166, 12.434463706161942], // 9. End of the bridge
    text: "🦕 Hvilken slags dinosaur var kendt for sin lange hals?",
    options: ["Brachiosaurus", "T-Rex", "Triceratops"],
    answer: "Brachiosaurus",
    type: "options",
    hint: "For enden af broen"
  },
  {
    coords: [55.68824114692889, 12.433749126035053], // 10. T junction further after bridge
    text: "⚽ Hvor mange spillere er der på et fodboldhold på banen ad gangen?",
    options: ["11", "7", "9"],
    answer: "11",
    type: "options",
    hint: "T-kryds længere efter broen"
  },
  {
    coords: [55.6878498,12.4354218], // 11.On way back from bridge road there is a no car roadsign
    text: "🍕 Hvilket land er pizza oprindeligt fra?",
    options: ["Italien", "USA", "Frankrig"],
    answer: "Italien",
    type: "options",
    hint: "På vej tilbage fra brovejen er der et 'kørsel forbudt' skilt"
  },
  {
    coords: [55.6880306,12.4357766], // 12. Entrance to military area on metal door
    text: "💧 Hvad består vand af?",
    options: ["H2O", "CO2", "O2"],
    answer: "H2O",
    type: "options",
    hint: "Indgang til militærområde på metaldør"
  },
  {
    coords: [55.68866504076029, 12.436271208776882], // 13. Map of bunkers and fortification
    text: "☀️ Hvad er den største stjerne i vores solsystem?",
    options: ["Solen", "Sirius", "Polaris"],
    answer: "Solen",
    type: "options",
    hint: "Kort over bunkers og befæstning"
  },
  {
    coords: [55.68836367049055, 12.436260537384154], // 14. Where there is a tank placed
    text: "🎨 Hvilken berømt maler malede Mona Lisa?",
    options: ["Leonardo da Vinci", "Picasso", "Van Gogh"],
    answer: "Leonardo da Vinci",
    type: "options",
    hint: "Hvor der er en tank placeret"
  },
  {
    coords: [55.68896476743011, 12.437271880241783], // 15. On one of the metal crossbars
    text: "⚡ Hvad hedder guden for torden i nordisk mytologi?",
    options: ["Thor", "Odin", "Loke"],
    answer: "Thor",
    type: "options",
    hint: "På en af metaltværbjælkerne"
  },
  {
    coords: [55.68946350583189, 12.436652953241998], // 16. Near ejbybunkers there should be a clue
    text: "🍌 Hvilket dyr elsker at spise bananer?",
    options: ["Abe", "Løve", "Elefant"],
    answer: "Abe",
    type: "options",
    hint: "Nær Ejbybunkers skulle der være et spor"
  },
  {
    coords: [55.686984776921854, 12.434759989174783], // 17. Hofor water station 
    text: "🗼 Hvilken by er kendt for Eiffeltårnet?",
    options: ["Paris", "London", "Rom"],
    answer: "Paris",
    type: "options",
    hint: "Hofor vandstation"
  },
  {
    coords: [55.68694652751955, 12.43714555066889], // 18. Another roadsign showing direction
    text: "🟡 Hvad hedder de små, gule hjælpere i filmen 'Grusomme Mig'?",
    options: ["Minions", "Smølfer", "Trolde"],
    answer: "Minions",
    type: "options",
    hint: "Endnu et vejskilt, der viser retning"
  },
  {
    coords: [55.68712902847947, 12.437522998133703], // 19. Speed limit sign 30
    text: "🏴‍☠️ Hvad kalder man en sørøvers flag?",
    options: ["Jolly Roger", "Dannebrog", "Union Jack"],
    answer: "Jolly Roger",
    type: "options",
    hint: "Fartgrænse 30-skilt"
  },
  {
    coords: [55.687411089962794, 12.437368926962439], // 20. Nørregardsvej road sign
    text: "😴 Hvad kalder man det, når en bjørn sover hele vinteren?",
    options: ["Gå i hi", "Dvale", "Snorke"],
    answer: "Gå i hi",
    type: "options",
    hint: "Nørregårdsvej vejskilt"
  },
  {
    coords: [55.687804768539785, 12.437697522257107], // 21. Metal frame at entrance of Nyskiftevej
    text: "👑 Hvad hedder prinsessen i filmen 'Frost'?",
    options: ["Elsa", "Anna", "Ariel"],
    answer: "Elsa",
    type: "options",
    hint: "Metalramme ved indgangen til Nyskiftevej"
  },
  {
    coords: [55.6877777791366, 12.438024632995544], // 22. Street lamp infront of house number 56
    text: "🚗 Hvilket bilmærke er kendt for sin 'folkevogn'?",
    options: ["Volkswagen", "Ford", "Toyota"],
    answer: "Volkswagen",
    type: "options",
    hint: "Gadelampe foran husnummer 56"
  },
  {
    coords: [55.68780802027629, 12.439163026610396], // 23. TDC box near house number 42
    text: "👃 Hvilken sans bruger en hund mest?",
    options: ["Lugtesansen", "Synet", "Hørelsen"],
    answer: "Lugtesansen",
    type: "options",
    hint: "TDC-boks nær husnummer 42"
  },
  {
    coords: [55.68782459987383, 12.43997944732714], // 24. Where is Oscar's house
    text: "🌙 Hvor mange måner har Jorden?",
    options: ["En", "To", "Ingen"],
    answer: "En",
    type: "options",
    hint: "Hvor er Oscars hus"
  },
  {
    coords: [55.68777105484344, 12.440442195797196], // 25. Mahims house
    text: "🧱 Hvad er LEGO klodser lavet af?",
    options: ["Plastik", "Træ", "Metal"],
    answer: "Plastik",
    type: "options",
    hint: "Mahims hus"
  }
];

// Shuffle the options for each clue to randomize the answer position
staticClues.forEach(clue => {
  if (clue.options) {
    shuffleArray(clue.options);
  }
});

export const clues = staticClues;