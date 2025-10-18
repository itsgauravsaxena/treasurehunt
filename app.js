import { clues } from './data.js';
import * as ui from './ui.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const teamsRef = database.ref('teams');

// Team setup and score logic
let teamId = sessionStorage.getItem('teamId') || null;
let teamName = sessionStorage.getItem('teamName') || '';
// clueProgress will store attempts and score for each clue, e.g., { "0": { attempts: 1, score: 3, solved: true } }
let clueProgress = JSON.parse(sessionStorage.getItem('clueProgress') || '{}');
let markers = [];

function calculateTotalScore() {
  // Calculate total score by summing up the points from each clue
  const score = Object.values(clueProgress).reduce((sum, clue) => sum + (clue.score || 0), 0);
  if (teamId) {
    teamsRef.child(teamId).update({ score: score });
  }
  return score;
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
  document.getElementById('leaderboard').classList.remove('hidden');
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
  sessionStorage.setItem('clueProgress', JSON.stringify(clueProgress));

  // Check if all clues are solved
  const solvedCount = Object.keys(clueProgress).filter(k => clueProgress[k].solved).length;
  if (solvedCount === clues.length) {
    setTimeout(ui.showCompletionBanner, 500);
  }
}

// --- Event Listeners and Global Handlers ---

function setupDevMode() {
  const devToggle = document.getElementById('dev-toggle'); // Listen for changes
  const isDevMode = localStorage.getItem('devMode') === 'true';

  // Apply state on load
  if (isDevMode) {
    devToggle.checked = true;
    document.body.classList.add('dev-mode');
  }

  // Listen for changes
  devToggle.addEventListener('change', () => {
    if (devToggle.checked) {
      document.body.classList.add('dev-mode');
      localStorage.setItem('devMode', 'true');
    } else {
      document.body.classList.remove('dev-mode');
      localStorage.setItem('devMode', 'false');
    }
  });
}

function listenForTeamUpdates() {
  teamsRef.orderByChild('score').on('value', (snapshot) => {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear current list
    const teams = [];
    snapshot.forEach((childSnapshot) => {
      teams.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Sort descending by score and render
    teams.reverse().forEach(team => {
      const li = document.createElement('li');
      li.textContent = `${team.name}: ${team.score}`;
      if (team.id === teamId) {
        li.classList.add('current-team');
      }
      leaderboardList.appendChild(li);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ui.hideCompletionBanner();
  initializeMarkers();
  listenForTeamUpdates();
  // If team name already set, skip setup
  if (teamId && teamName) {
    startGame();
    ui.setTeamNameInput(teamName);
  }

  setupDevMode();
});

document.getElementById('start-btn').onclick = () => {
  const input = document.getElementById('team-name');
  const name = input.value.trim();
  if (!name) {
    input.style.borderColor = 'red';
    input.focus();
    return;
  }

  // Create a new team in Firebase
  const newTeamRef = teamsRef.push();
  teamId = newTeamRef.key;
  teamName = name;
  newTeamRef.set({
    name: teamName,
    score: 0
  });
  sessionStorage.setItem('teamId', teamId);
  sessionStorage.setItem('teamName', teamName);
  startGame();
};

// Allow pressing Enter to start
document.getElementById('team-name').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('start-btn').click();
  }
});

// Clear leaderboard logic (dev mode only)
document.getElementById('clear-leaderboard-btn').onclick = () => {
  if (confirm('ADVARSEL: Dette vil slette ALLE hold og point fra leaderboardet. Er du helt sikker?')) {
    // This removes the entire 'teams' node from Firebase
    teamsRef.remove()
      .then(() => console.log("Leaderboard cleared successfully."))
      .catch(error => console.error("Error clearing leaderboard: ", error));
  }
};

// Reset game logic
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Er I sikre på, I vil starte forfra? Alle jeres point og jeres holdnavn forsvinder.')) {
    if (teamId) {
      teamsRef.child(teamId).remove();
    }
    ui.hideCompletionBanner();
    sessionStorage.removeItem('teamId');
    sessionStorage.removeItem('teamName');
    sessionStorage.removeItem('clueProgress');
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
    sessionStorage.setItem('clueProgress', JSON.stringify(clueProgress));
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
    sessionStorage.setItem('clueProgress', JSON.stringify(clueProgress));
    feedbackDiv.innerHTML = `Prøv igen! I kan godt! 💪`;
    feedbackDiv.className = 'popup-feedback error';
  }
};