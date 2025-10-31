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
    ageGroup: "9-11",
    hint: "Købmand den mest populære"
  },
  {
    coords: [55.68695494871787, 12.439874297646213], // 2. Ejbyvej road sign
    text: "🦁 Hvad er det hurtigste landdyr i verden?",
    options: ["Gepard", "Løve", "Hest"],
    answer: "Gepard",
    type: "options",
    ageGroup: "9-11",
    hint: "Ejbyvej vejskilt"
  },
  {
    coords: [55.687032690311014, 12.438615004732753], // 3. Behind the pole ejbyvænge
    text: "🌍 Hvilken planet er kendt som 'den røde planet'?",
    options: ["Mars", "Jupiter", "Venus"],
    answer: "Mars",
    type: "options",
    ageGroup: "9-11",
    hint: "Bag pælen ved Ejbyvænge"
  },
  {
    coords: [55.686960424146285, 12.437665374624837], // 4. Behind arrow sign on road
    text: "🇩🇰 Hvad hedder Danmarks hovedstad?",
    options: ["København", "Aarhus", "Odense"],
    answer: "København",
    type: "options",
    ageGroup: "9-11",
    hint: "Bag pileskiltet på vejen"
  },
  {
    coords: [55.686970142729656, 12.43602611815933], // 5. 2 Little TDC boxes
    text: "🦸 Hvilken superhelt er kendt for at svinge sig mellem bygninger i New York?",
    options: ["Spider-Man", "Superman", "Batman"],
    answer: "Spider-Man",
    type: "options",
    ageGroup: "9-11",
    hint: "2 små TDC-bokse"
  },
  {
    coords: [55.6869651359237, 12.435446941494142], // 6. Another TDC box
    text: "🌊 Hvad er det største hav i verden?",
    options: ["Stillehavet", "Atlanterhavet", "Det Indiske Ocean"],
    answer: "Stillehavet",
    type: "options",
    ageGroup: "12-14",
    hint: "Endnu en TDC-boks"
  },
  {
    coords: [55.6875977,12.4354654], // 7. Old bunker building
    text: "📖 Hvem har skrevet bøgerne om Harry Potter?",
    options: ["J.K. Rowling", "H.C. Andersen", "Astrid Lindgren"],
    answer: "J.K. Rowling",
    type: "options",
    ageGroup: "9-11",
    hint: "Gammel bunkebygning"
  },
  {
    coords: [55.6879552,12.4349564], // 8. Pillar before bridge
    text: "📱 Hvilket firma laver iPhone?",
    options: ["Apple", "Samsung", "Google"],
    answer: "Apple",
    type: "options",
    ageGroup: "9-11",
    hint: "Søjle før broen"
  },
  {
    coords: [55.68807811514166, 12.434463706161942], // 9. End of the bridge
    text: "🦕 Hvilken slags dinosaur var kendt for sin lange hals?",
    options: ["Brachiosaurus", "T-Rex", "Triceratops"],
    answer: "Brachiosaurus",
    type: "options",
    ageGroup: "9-11",
    hint: "For enden af broen"
  },
  {
    coords: [55.68824114692889, 12.433749126035053], // 10. T junction further after bridge
    text: "⚽ Hvor mange spillere er der på et fodboldhold på banen ad gangen?",
    options: ["11", "7", "9"],
    answer: "11",
    type: "options",
    ageGroup: "9-11",
    hint: "T-kryds længere efter broen"
  },
  {
    coords: [55.6878498,12.4354218], // 11.On way back from bridge road there is a no car roadsign
    text: "🍕 Hvilket land er pizza oprindeligt fra?",
    options: ["Italien", "USA", "Frankrig"],
    answer: "Italien",
    type: "options",
    ageGroup: "9-11",
    hint: "På vej tilbage fra brovejen er der et 'kørsel forbudt' skilt"
  },
  {
    coords: [55.6880306,12.4357766], // 12. Entrance to military area on metal door
    text: "💧 Hvad består vand af?",
    options: ["H2O", "CO2", "O2"],
    answer: "H2O",
    type: "options",
    ageGroup: "12-14",
    hint: "Indgang til militærområde på metaldør"
  },
  {
    coords: [55.68866504076029, 12.436271208776882], // 13. Map of bunkers and fortification
    text: "☀️ Hvad er den største stjerne i vores solsystem?",
    options: ["Solen", "Sirius", "Polaris"],
    answer: "Solen",
    type: "options",
    ageGroup: "9-11",
    hint: "Kort over bunkers og befæstning"
  },
  {
    coords: [55.68836367049055, 12.436260537384154], // 14. Where there is a tank placed
    text: "🎨 Hvilken berømt maler malede Mona Lisa?",
    options: ["Leonardo da Vinci", "Picasso", "Van Gogh"],
    answer: "Leonardo da Vinci",
    type: "options",
    ageGroup: "12-14",
    hint: "Hvor der er en tank placeret"
  },
  {
    coords: [55.68896476743011, 12.437271880241783], // 15. On one of the metal crossbars
    text: "⚡ Hvad hedder guden for torden i nordisk mytologi?",
    options: ["Thor", "Odin", "Loke"],
    answer: "Thor",
    type: "options",
    ageGroup: "9-11",
    hint: "På en af metaltværbjælkerne"
  },
  {
    coords: [55.68946350583189, 12.436652953241998], // 16. Near ejbybunkers there should be a clue
    text: "🍌 Hvilket dyr elsker at spise bananer?",
    options: ["Abe", "Løve", "Elefant"],
    answer: "Abe",
    type: "options",
    ageGroup: "9-11",
    hint: "Nær Ejbybunkers skulle der være et spor"
  },
  {
    coords: [55.686984776921854, 12.434759989174783], // 17. Hofor water station 
    text: "🗼 Hvilken by er kendt for Eiffeltårnet?",
    options: ["Paris", "London", "Rom"],
    answer: "Paris",
    type: "options",
    ageGroup: "9-11",
    hint: "Hofor vandstation"
  },
  {
    coords: [55.68694652751955, 12.43714555066889], // 18. Another roadsign showing direction
    text: "🟡 Hvad hedder de små, gule hjælpere i filmen 'Grusomme Mig'?",
    options: ["Minions", "Smølfer", "Trolde"],
    answer: "Minions",
    type: "options",
    ageGroup: "9-11",
    hint: "Endnu et vejskilt, der viser retning"
  },
  {
    coords: [55.68712902847947, 12.437522998133703], // 19. Speed limit sign 30
    text: "🏴‍☠️ Hvad kalder man en sørøvers flag?",
    options: ["Jolly Roger", "Dannebrog", "Union Jack"],
    answer: "Jolly Roger",
    type: "options",
    ageGroup: "12-14",
    hint: "Fartgrænse 30-skilt"
  },
  {
    coords: [55.687411089962794, 12.437368926962439], // 20. Nørregardsvej road sign
    text: "😴 Hvad kalder man det, når en bjørn sover hele vinteren?",
    options: ["Gå i hi", "Dvale", "Snorke"],
    answer: "Gå i hi",
    type: "options",
    ageGroup: "9-11",
    hint: "Nørregårdsvej vejskilt"
  },
  {
    coords: [55.687804768539785, 12.437697522257107], // 21. Metal frame at entrance of Nyskiftevej
    text: "👑 Hvad hedder prinsessen i filmen 'Frost'?",
    options: ["Elsa", "Anna", "Ariel"],
    answer: "Elsa",
    type: "options",
    ageGroup: "9-11",
    hint: "Metalramme ved indgangen til Nyskiftevej"
  },
  {
    coords: [55.6877777791366, 12.438024632995544], // 22. Street lamp infront of house number 56
    text: "🚗 Hvilket bilmærke er kendt for sin 'folkevogn'?",
    options: ["Volkswagen", "Ford", "Toyota"],
    answer: "Volkswagen",
    type: "options",
    ageGroup: "12-14",
    hint: "Gadelampe foran husnummer 56"
  },
  {
    coords: [55.68780802027629, 12.439163026610396], // 23. TDC box near house number 42
    text: "👃 Hvilken sans bruger en hund mest?",
    options: ["Lugtesansen", "Synet", "Hørelsen"],
    answer: "Lugtesansen",
    type: "options",
    ageGroup: "9-11",
    hint: "TDC-boks nær husnummer 42"
  },
  {
    coords: [55.68782459987383, 12.43997944732714], // 24. Where is Oscar's house
    text: "🌙 Hvor mange måner har Jorden?",
    options: ["En", "To", "Ingen"],
    answer: "En",
    type: "options",
    ageGroup: "9-11",
    hint: "Hvor er Oscars hus"
  },
  {
    coords: [55.68777105484344, 12.440442195797196], // 25. Mahims house
    text: "🧱 Hvad er LEGO klodser lavet af?",
    options: ["Plastik", "Træ", "Metal"],
    answer: "Plastik",
    type: "options",
    ageGroup: "9-11",
    hint: "Mahims hus"
  }
  ,
  {
    coords: [55.6876, 12.4408], // 26. New clue
    text: "🎨 Hvilken farve har en smølf?",
    options: ["Blå", "Grøn", "Rød"],
    answer: "Blå",
    type: "options",
    ageGroup: "9-11",
    hint: "Kig ved et træ med et fuglehus."
  },
  {
    coords: [55.6874, 12.4410], // 27. New clue
    text: "⚡ Hvad hedder den gule, elektriske Pokémon, som er Ash's bedste ven?",
    options: ["Pikachu", "Charmander", "Squirtle"],
    answer: "Pikachu",
    type: "options",
    ageGroup: "9-11",
    hint: "Find en rød postkasse."
  },
  {
    coords: [55.6872, 12.4405], // 28. New clue
    text: "📅 Hvor mange dage er der i et normalt år?",
    options: ["365", "366", "360"],
    answer: "365",
    type: "options",
    ageGroup: "9-11",
    hint: "Under en stor sten."
  },
  {
    coords: [55.6870, 12.4400], // 29. New clue
    text: "🐄 Hvilket dyr siger 'muh'?",
    options: ["Ko", "Gris", "Får"],
    answer: "Ko",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved siden af skraldespanden."
  },
  {
    coords: [55.6868, 12.4395], // 30. New clue
    text: "✖️ Hvad er 7 x 8?",
    options: ["56", "49", "64"],
    answer: "56",
    type: "options",
    ageGroup: "9-11",
    hint: "På en lygtepæl."
  },
  {
    coords: [55.6867, 12.4385], // 31. New clue
    text: "🦸 Hvilken superhelt kan flyve og er fra planeten Krypton?",
    options: ["Superman", "Batman", "Iron Man"],
    answer: "Superman",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved indgangen til parken."
  },
  {
    coords: [55.6868, 12.4375], // 32. New clue
    text: "🐱 Hvad kalder man en baby-kat?",
    options: ["Killing", "Hvalp", "Føl"],
    answer: "Killing",
    type: "options",
    ageGroup: "9-11",
    hint: "Bag en busk."
  },
  {
    coords: [55.6870, 12.4365], // 33. New clue
    text: "🔺 Hvilket land er kendt for pyramiderne?",
    options: ["Egypten", "Kina", "Mexico"],
    answer: "Egypten",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved et 'Parkering Forbudt' skilt."
  },
  {
    coords: [55.6885, 12.4355], // 34. New clue
    text: "🕷️ Hvor mange ben har en edderkop?",
    options: ["8", "6", "10"],
    answer: "8",
    type: "options",
    ageGroup: "9-11",
    hint: "På et spindelvæv i et hjørne."
  },
  {
    coords: [55.6890, 12.4350], // 35. New clue
    text: "🌈 Hvilken farve får man, hvis man blander rød og blå?",
    options: ["Lilla", "Grøn", "Orange"],
    answer: "Lilla",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved en farverig blomsterbusk."
  },
  {
    coords: [55.6895, 12.4345], // 36. New clue
    text: "🐋 Hvad er det største dyr i verden?",
    options: ["Blåhval", "Elefant", "Giraf"],
    answer: "Blåhval",
    type: "options",
    ageGroup: "9-11",
    hint: "Kig mod den store åbne plads."
  },
  {
    coords: [55.6892, 12.4335], // 37. New clue
    text: "👨‍🚀 Hvem var den første person på månen?",
    options: ["Neil Armstrong", "Buzz Aldrin", "Andreas Mogensen"],
    answer: "Neil Armstrong",
    type: "options",
    ageGroup: "12-14",
    hint: "Ved en flagstang."
  },
  {
    coords: [55.6888, 12.4330], // 38. New clue
    text: "🎹 Hvilket instrument har typisk 88 tangenter?",
    options: ["Klaver", "Guitar", "Trompet"],
    answer: "Klaver",
    type: "options",
    ageGroup: "9-11",
    hint: "På en bænk, hvor man kan sidde."
  },
  {
    coords: [55.6884, 12.4325], // 39. New clue
    text: "🧙‍♂️ Hvad hedder den onde troldmand i Harry Potter?",
    options: ["Voldemort", "Dumbledore", "Snape"],
    answer: "Voldemort",
    type: "options",
    ageGroup: "9-11",
    hint: "Et mørkt og skyggefuldt sted."
  },
  {
    coords: [55.6880, 12.4320], // 40. New clue
    text: "🏸 Hvilken sport bruger man en fjerbold i?",
    options: ["Badminton", "Tennis", "Squash"],
    answer: "Badminton",
    type: "options",
    ageGroup: "9-11",
    hint: "Nær et net eller hegn."
  },
  {
    coords: [55.6876, 12.4325], // 41. New clue
    text: "🐴 Hvad hedder Pippi Langstrømpes plettede hest?",
    options: ["Lille Gubben", "Hr. Nilsson", "Tornado"],
    answer: "Lille Gubben",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved en pæl med et hestesymbol."
  },
  {
    coords: [55.6872, 12.4330], // 42. New clue
    text: "🦁 Hvad kalder man en gruppe af løver?",
    options: ["En stolthed", "En flok", "En bande"],
    answer: "En stolthed",
    type: "options",
    ageGroup: "12-14",
    hint: "Et sted hvor man kan samles."
  },
  {
    coords: [55.6874, 12.4340], // 43. New clue
    text: "🎬 Hvilken Disney-film handler om en løveunge ved navn Simba?",
    options: ["Løvernes Konge", "Aladdin", "Tarzan"],
    answer: "Løvernes Konge",
    type: "options",
    ageGroup: "9-11",
    hint: "På en bakketop med god udsigt."
  },
  {
    coords: [55.6879, 12.4370], // 44. New clue
    text: "➕ Hvad er 12 x 12?",
    options: ["144", "124", "132"],
    answer: "144",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved et skilt med tal på."
  },
  {
    coords: [55.6882, 12.4380], // 45. New clue
    text: "🌎 Hvilket kontinent er det største i verden?",
    options: ["Asien", "Afrika", "Nordamerika"],
    answer: "Asien",
    type: "options",
    ageGroup: "12-14",
    hint: "Find det største træ i nærheden."
  }
  ,
  {
    coords: [55.6898, 12.4360], // 46. New clue
    text: "🐼 Hvad spiser en panda næsten udelukkende?",
    options: ["Bambus", "Fisk", "Bær"],
    answer: "Bambus",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved en gruppe af høje, tynde træer."
  },
  {
    coords: [55.6896, 12.4370], // 47. New clue
    text: "🇦🇺 Hvilket land er berømt for sine kænguruer og koalaer?",
    options: ["Australien", "Canada", "Brasilien"],
    answer: "Australien",
    type: "options",
    ageGroup: "9-11",
    hint: "Et sted hvor man kan hoppe."
  },
  {
    coords: [55.6893, 12.4380], // 48. New clue
    text: "⭐ Hvad kalder man en person, der studerer stjerner og planeter?",
    options: ["Astronom", "Biolog", "Geolog"],
    answer: "Astronom",
    type: "options",
    ageGroup: "12-14",
    hint: "Kig op mod himlen fra et åbent område."
  },
  {
    coords: [55.6890, 12.4390], // 49. New clue
    text: "🍄 Hvad sker der med Mario, når han spiser en Super Mushroom?",
    options: ["Han bliver større", "Han bliver usynlig", "Han kan flyve"],
    answer: "Han bliver større",
    type: "options",
    ageGroup: "9-11",
    hint: "Under noget, der ligner en svamp."
  },
  {
    coords: [55.6887, 12.4400], // 50. New clue
    text: "🧠 Hvilket organ i kroppen pumper blod rundt?",
    options: ["Hjertet", "Hjernen", "Lungen"],
    answer: "Hjertet",
    type: "options",
    ageGroup: "9-11",
    hint: "I midten af det hele."
  },
  {
    coords: [55.6884, 12.4410], // 51. New clue
    text: "💡 Hvem opfandt pæren?",
    options: ["Thomas Edison", "Albert Einstein", "Isaac Newton"],
    answer: "Thomas Edison",
    type: "options",
    ageGroup: "12-14",
    hint: "Ved en lygtepæl, der lyser op."
  },
  {
    coords: [55.6881, 12.4420], // 52. New clue
    text: "🎶 Hvilket instrument har strenge, man slår på med små hamre?",
    options: ["Klaver", "Violin", "Guitar"],
    answer: "Klaver",
    type: "options",
    ageGroup: "9-11",
    hint: "På en bænk med sorte og hvide striber."
  },
  {
    coords: [55.6878, 12.4430], // 53. New clue
    text: "📚 Hvad hedder skolen i Harry Potter-bøgerne?",
    options: ["Hogwarts", "Beauxbatons", "Durmstrang"],
    answer: "Hogwarts",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved en bygning, der ligner en skole."
  },
  {
    coords: [55.6875, 12.4440], // 54. New clue
    text: "🧭 Hvilket instrument bruger man til at finde nord?",
    options: ["Kompas", "Kikkert", "Ur"],
    answer: "Kompas",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved et skilt, der peger i en retning."
  },
  {
    coords: [55.6872, 12.4450], // 55. New clue
    text: "🌍 Hvad er verdens højeste bjerg?",
    options: ["Mount Everest", "K2", "Mont Blanc"],
    answer: "Mount Everest",
    type: "options",
    ageGroup: "12-14",
    hint: "Find det højeste punkt i nærheden."
  },
  {
    coords: [55.6869, 12.4460], // 56. New clue
    text: "💧 I hvilken tilstand er vand, når det er is?",
    options: ["Fast", "Flydende", "Gas"],
    answer: "Fast",
    type: "options",
    ageGroup: "9-11",
    hint: "Et koldt sted i skyggen."
  },
  {
    coords: [55.6866, 12.4450], // 57. New clue
    text: "🗡️ Hvad hedder hovedpersonen i spilserien 'The Legend of Zelda'?",
    options: ["Link", "Zelda", "Ganon"],
    answer: "Link",
    type: "options",
    ageGroup: "9-11",
    hint: "Ved en kæde eller et hegn."
  },
  {
    coords: [55.6863, 12.4440], // 58. New clue
    text: "🌈 Hvor mange farver er der i en regnbue?",
    options: ["7", "6", "8"],
    answer: "7",
    type: "options",
    ageGroup: "9-11",
    hint: "Find noget med mange farver."
  },
  {
    coords: [55.6860, 12.4430], // 59. New clue
    text: "🌲 Hvad kalder man en skov med grantræer?",
    options: ["Nåleskov", "Løvskov", "Regnskov"],
    answer: "Nåleskov",
    type: "options",
    ageGroup: "12-14",
    hint: "Under et stedsegrønt træ."
  },
  {
    coords: [55.6863, 12.4420], // 60. New clue
    text: "🏛️ Hvem var gudernes konge i græsk mytologi?",
    options: ["Zeus", "Hades", "Poseidon"],
    answer: "Zeus",
    type: "options",
    ageGroup: "12-14",
    hint: "Ved en statue eller en søjle."
  },
  {
    coords: [55.6866, 12.4410], // 61. New clue
    text: "🦴 Hvad kalder man en videnskabsmand, der studerer dinosaurer?",
    options: ["Palæontolog", "Arkæolog", "Zoolog"],
    answer: "Palæontolog",
    type: "options",
    ageGroup: "12-14",
    hint: "Et sted hvor man kan grave i jorden."
  },
  {
    coords: [55.6899, 12.4425], // 62. New clue
    text: "🦇 Hvilket pattedyr kan flyve?",
    options: ["Flagermus", "Egern", "Mus"],
    answer: "Flagermus",
    type: "options",
    ageGroup: "9-11",
    hint: "Kig op i et gammelt træ."
  },
  {
    coords: [55.6897, 12.4435], // 63. New clue
    text: "📱 Hvad står 'SMS' for?",
    options: ["Short Message Service", "Super hurtig besked", "Send min besked"],
    answer: "Short Message Service",
    type: "options",
    ageGroup: "12-14",
    hint: "Ved et informationsskilt."
  },
  {
    coords: [55.6894, 12.4455], // 64. New clue
    text: "🌊 Hvilket dyr er kendt for at bygge dæmninger i floder?",
    options: ["Bæver", "Odder", "Sæl"],
    answer: "Bæver",
    type: "options",
    ageGroup: "9-11",
    hint: "Nær vandet."
  },
  {
    coords: [55.6891, 12.4470], // 65. New clue
    text: "💨 Hvilken gas bruger planter til at lave fotosyntese?",
    options: ["Kuldioxid (CO2)", "Ilt (O2)", "Brint (H2)"],
    answer: "Kuldioxid (CO2)",
    type: "options",
    ageGroup: "12-14",
    hint: "Ved en stor grøn plante."
  }
];

// Shuffle the options for each clue to randomize the answer position
staticClues.forEach(clue => {
  if (clue.options) {
    shuffleArray(clue.options);
  }
});

export const clues = staticClues;