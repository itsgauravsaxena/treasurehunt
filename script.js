// Ensure banner is hidden on page load
document.addEventListener('DOMContentLoaded', function() {
  hideCompletionBanner();
});

// Team setup and score logic
var teamName = localStorage.getItem('teamName') || '';
var solvedClues = JSON.parse(localStorage.getItem('solvedClues') || '[]');

function updateScore() {
  document.getElementById('team-score').textContent = 'Point: ' + solvedClues.length;
}

function showMap() {
  document.getElementById('team-setup').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  document.getElementById('team-header').style.display = 'block';
  document.getElementById('team-name-display').textContent = teamName ? 'Hold: ' + teamName : '';
  updateScore();
  // Invalidate map size to ensure it renders correctly after being un-hidden
  setTimeout(function() {
    map.invalidateSize();
  }, 0);
}

document.getElementById('start-btn').onclick = function() {
  var input = document.getElementById('team-name');
  var name = input.value.trim();
  if (!name) {
    input.style.borderColor = 'red';
    input.focus();
    return;
  }
  teamName = name;
  localStorage.setItem('teamName', teamName);
  showMap();
};

// Allow pressing Enter to start
document.getElementById('team-name').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('start-btn').click();
  }
});
// If team name already set, skip setup
if (teamName) {
  showMap();
  document.getElementById('team-name').value = teamName;
}

// Reset game logic
document.getElementById('reset-btn').onclick = function() {
  if (confirm('Er I sikre på, I vil starte forfra? Alle jeres point og jeres holdnavn forsvinder.')) {
    hideCompletionBanner();
    // Clear all saved data from localStorage
    localStorage.removeItem('teamName');
    localStorage.removeItem('solvedClues');

    // Reset in-memory variables
    teamName = '';
    solvedClues = [];

    // Reload the page to go back to the setup screen
    window.location.reload();
  }
};

// Initialize map with smooth zoom and optimized rendering
var map = L.map('map', {
  zoomControl: false,
  preferCanvas: true
}).setView([55.687866247454544, 12.440356125771856], 14);

L.control.zoom({ position: 'topright' }).addTo(map);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define treasure hunt markers with options
var clues = [
  {
    coords: [55.68708054917811, 12.441355926742244],
    text: "🪙 Første spor: Kig ved det store springvand!",
    options: ["Bænk", "Springvand", "Statue"],
    answer: "Springvand",
    type: "options"
  },
  {
    coords: [55.68696448408725, 12.437444152834074],
    text: "🌳 Andet spor: Skatten gemmer sig under det høje egetræ!",
    options: ["Fyrretræ", "Egetræ", "Birketræ"],
    answer: "Egetræ",
    type: "options"
  },
  {
    coords: [55.68701542511072, 12.435067896667386],
    text: "🎠 Tredje spor: Find det sted, hvor børn elsker at lege.",
    answer: "Legeplads",
    type: "text"
  },
  {
    coords: [55.6888914067698, 12.43559286853583],
    text: "☀️ Fjerde spor: Skatten er begravet, hvor solen skinner klart.",
    options: ["Skygge", "Solrig mark", "Flodbred"],
    answer: "Solrig mark",
    type: "options"
  },
  {
    coords: [55.690002484238356, 12.436452599450709],
    text: "🤫 Femte spor: Et hemmeligt sted, hvor solen altid kan finde dig.",
    answer: "Solrig mark",
    type: "text"
  },
  {
    coords: [55.6895, 12.4420],
    text: "🌉 Sjette spor: Hvad finder du ved vandet, som lader dig krydse over?",
    options: ["Båd", "Bro", "Sten"],
    answer: "Bro",
    type: "options"
  }
];

// Define default and checkmark icons
var defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

var checkIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png', // checkmark emoji
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28]
});

// Add markers with interactive popups
var markers = [];
clues.forEach(function(clue, idx) {
  var icon = solvedClues.includes(idx) ? checkIcon : defaultIcon;
  var marker = L.marker(clue.coords, { icon: icon }).addTo(map);
  markers.push(marker);

  // Build the popup content once
  var popupContent = `<b>${clue.text}</b><br><div id='options-${idx}'>`;
  if (clue.type === "options") {
    clue.options.forEach(function(opt) {
      popupContent += `<button style='margin:4px 2px;padding:4px 10px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer;' onclick=\"window.selectAnswer(${idx}, '${opt}')\">${opt}</button>`;
    });
  } else if (clue.type === "text") {
    popupContent += `<input type='text' id='input-${idx}' style='margin:4px 2px;padding:4px 10px;border-radius:6px;border:1px solid #ccc;width:120px;' placeholder='Skriv jeres svar...' />`;
    popupContent += `<button style='margin:4px 2px;padding:4px 10px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer;' onclick=\"window.submitTextAnswer(${idx})\">Gæt</button>`;
  }
  popupContent += `</div><div id='feedback-${idx}' style='margin-top:8px;'></div>`;
  marker.bindPopup(popupContent);

  // Prevent popups from closing when interacting with content inside them
  marker.on('popupopen', function() {
    var popupContainer = marker.getPopup().getElement().querySelector('.leaflet-popup-content');
    L.DomEvent.disableClickPropagation(popupContainer);
  });
});

// --- Game Completion Logic ---
function hideCompletionBanner() {
  var banner = document.getElementById('completion-banner');
  banner.style.display = 'none';
  banner.style.transform = 'translateY(-100%)';
}

function showCompletionBanner() {
  var banner = document.getElementById('completion-banner');
  banner.style.display = 'block';
  banner.style.transform = 'translateY(0)';

  // Start the confetti!
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 }
  });
}

function handleCorrectAnswer(idx) {
  markers[idx].setIcon(checkIcon);
  if (!solvedClues.includes(idx)) {
    solvedClues.push(idx);
    localStorage.setItem('solvedClues', JSON.stringify(solvedClues));
    updateScore();

    // Check if all clues are solved
    if (solvedClues.length === clues.length) {
      // Use a timeout to let the user see the last checkmark
      setTimeout(showCompletionBanner, 500);
    }
  }
}

// --- Answer Handlers ---
window.selectAnswer = function(idx, selected) {
  var feedbackDiv = map.getPane('popupPane').querySelector('#feedback-' + idx);
  if (selected === clues[idx].answer) {
    feedbackDiv.innerHTML = `<span style='color:green;font-weight:bold;'>Helt rigtigt! Godt gået! 🎉</span>`;
    handleCorrectAnswer(idx);
  } else {
    feedbackDiv.innerHTML = `<span style='color:red;font-weight:bold;'>Prøv igen! I kan godt! 💪</span>`;
  }
};
window.submitTextAnswer = function(idx) {
  var input = map.getPane('popupPane').querySelector('#input-' + idx);
  var feedbackDiv = map.getPane('popupPane').querySelector('#feedback-' + idx);
  if (!input) return;
  var val = input.value.trim();
  if (val.toLowerCase() === clues[idx].answer.toLowerCase()) {
    feedbackDiv.innerHTML = `<span style='color:green;font-weight:bold;'>Helt rigtigt! Godt gået! 🎉</span>`;
    handleCorrectAnswer(idx);
  } else {
    feedbackDiv.innerHTML = `<span style='color:red;font-weight:bold;'>Prøv igen! I kan godt! 💪</span>`;
  }
};