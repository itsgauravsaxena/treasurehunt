import { clues } from './data.js';
import * as ui from './ui.js';

// Team setup and score logic
let teamName = localStorage.getItem('teamName') || '';
// clueProgress will store attempts and score for each clue, e.g., { "0": { attempts: 1, score: 3, solved: true } }
let clueProgress = JSON.parse(localStorage.getItem('clueProgress') || '{}');
let markers = [];

function calculateTotalScore() {
  // Calculate total score by summing up the points from each clue
  return Object.values(clueProgress).reduce((sum, clue) => sum + (clue.score || 0), 0);
}

// Initialize map with smooth zoom and optimized rendering
const map = L.map('map', {
  zoomControl: false,
  preferCanvas: true
}).setView([55.687866247454544, 12.440356125771856], 14);

L.control.zoom({ position: 'topright' }).addTo(map);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function startGame() {
  ui.showMap(map, teamName, calculateTotalScore());
}

function initializeMarkers() {
  clues.forEach((clue, idx) => {
    const isSolved = clueProgress[idx] && clueProgress[idx].solved;
    const icon = ui.createNumberedIcon(idx + 1, isSolved);
    const marker = L.marker(clue.coords, { icon }).addTo(map);
    markers.push(marker);

    // Build the popup content
    let popupContent = `<b>Spor ${idx + 1}</b><span class="hidden-clue-text">${clue.text}</span><br><div id='options-${idx}'>`;
    if (clue.type === "options") {
      clue.options.forEach(opt => {
        popupContent += `<button class="popup-btn btn-secondary" style="margin:4px;" onclick="window.selectAnswer(${idx}, '${opt}')">${opt}</button>`;
      });
    } else if (clue.type === "text") {
      popupContent += `<input type='text' id='input-${idx}' class="popup-input" style="margin:4px; width: 140px; padding: 8px; font-size: 0.7em;" placeholder='Skriv svar...' />`;
      popupContent += `<button class="popup-submit-btn" style="margin:4px;" onclick="window.submitTextAnswer(${idx})">Gæt</button>`;
    }
    popupContent += `</div><div id='feedback-${idx}' class='popup-feedback'></div>`;
    marker.bindPopup(popupContent);

    // Prevent popups from closing when interacting with content inside them
    marker.on('popupopen', () => {
      const popupContainer = marker.getPopup().getElement().querySelector('.leaflet-popup-content');
      L.DomEvent.disableClickPropagation(popupContainer);
    });
  });
}

function handleCorrectAnswer(idx) {
  // Initialize progress if it doesn't exist
  if (!clueProgress[idx]) {
    clueProgress[idx] = { attempts: 0, solved: false, score: 0 };
  }

  // Only proceed if the clue hasn't been solved yet
  if (clueProgress[idx].solved) {
    return;
  }

  clueProgress[idx].attempts += 1;
  clueProgress[idx].solved = true;

  let pointsWon = 0;
  // Calculate points based on attempts
  if (clueProgress[idx].attempts === 1) {
    pointsWon = 3;
  } else if (clueProgress[idx].attempts === 2) {
    pointsWon = 2;
  } else {
    pointsWon = 1;
  }
  clueProgress[idx].score = pointsWon;

  // Show the flying points animation
  ui.showFlyingPoints(pointsWon);

  // Update UI
  const solvedIcon = ui.createNumberedIcon(idx + 1, true);
  markers[idx].setIcon(solvedIcon);
  ui.updateScoreDisplay(calculateTotalScore());
  localStorage.setItem('clueProgress', JSON.stringify(clueProgress));

  // Check if all clues are solved
  const solvedCount = Object.values(clueProgress).filter(p => p.solved).length;
  if (solvedCount === clues.length) {
    setTimeout(ui.showCompletionBanner, 500);
  }
}

// --- Event Listeners and Global Handlers ---

document.addEventListener('DOMContentLoaded', () => {
  ui.hideCompletionBanner();
  initializeMarkers();

  // If team name already set, skip setup
  if (teamName) {
    startGame();
    ui.setTeamNameInput(teamName);
  }
});

document.getElementById('start-btn').onclick = () => {
  const input = document.getElementById('team-name');
  const name = input.value.trim();
  if (!name) {
    input.style.borderColor = 'red';
    input.focus();
    return;
  }
  teamName = name;
  localStorage.setItem('teamName', teamName);
  startGame();
};

// Allow pressing Enter to start
document.getElementById('team-name').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('start-btn').click();
  }
});

// Reset game logic
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Er I sikre på, I vil starte forfra? Alle jeres point og jeres holdnavn forsvinder.')) {
    ui.hideCompletionBanner();
    localStorage.removeItem('teamName');
    localStorage.removeItem('clueProgress');
    window.location.reload();
  }
};

// --- Answer Handlers (exposed to global scope for inline HTML onclick) ---

window.selectAnswer = (idx, selected) => {
  const feedbackDiv = map.getPane('popupPane').querySelector(`#feedback-${idx}`);
  if (clueProgress[idx] && clueProgress[idx].solved) return; // Already solved

  if (selected === clues[idx].answer) {
    feedbackDiv.innerHTML = `Helt rigtigt! Godt gået! 🎉`;
    feedbackDiv.className = 'popup-feedback success';
    handleCorrectAnswer(idx);
  } else {
    if (!clueProgress[idx]) clueProgress[idx] = { attempts: 0 };
    clueProgress[idx].attempts += 1;
    localStorage.setItem('clueProgress', JSON.stringify(clueProgress));
    feedbackDiv.innerHTML = `Prøv igen! I kan godt! 💪`;
    feedbackDiv.className = 'popup-feedback error';
  }
};

window.submitTextAnswer = (idx) => {
  const input = map.getPane('popupPane').querySelector(`#input-${idx}`);
  const feedbackDiv = map.getPane('popupPane').querySelector(`#feedback-${idx}`);
  if (!input || (clueProgress[idx] && clueProgress[idx].solved)) return; // No input or already solved

  const val = input.value.trim();
  if (val.toLowerCase() === clues[idx].answer.toLowerCase()) {
    feedbackDiv.innerHTML = `Helt rigtigt! Godt gået! 🎉`;
    feedbackDiv.className = 'popup-feedback success';
    handleCorrectAnswer(idx);
  } else {
    if (!clueProgress[idx]) clueProgress[idx] = { attempts: 0 };
    clueProgress[idx].attempts += 1;
    localStorage.setItem('clueProgress', JSON.stringify(clueProgress));
    feedbackDiv.innerHTML = `Prøv igen! I kan godt! 💪`;
    feedbackDiv.className = 'popup-feedback error';
  }
};