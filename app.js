import { clues } from './data.js';
import * as ui from './ui.js';
import { firebaseConfig } from './firebase-config.js';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const teamsRef = database.ref('teams');

// --- App State ---
const APP_VERSION = '1.1'; // Increment this when clue data structure changes

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
});

L.control.zoom({ position: 'topright' }).addTo(map);

// Center the map on the first clue to guide the players
map.setView(clues[0].coords, 16); // A zoom level of 16 is good for focusing on a specific spot

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function startGame(isNewGame) {
  document.getElementById('leaderboard').classList.remove('hidden');
  ui.showMap(map, teamName, calculateTotalScore());
  initializeMarkers();
  if (isNewGame) teamsRef.child(teamId).set({ name: teamName, score: 0 });
}

function initializeMarkers() {
  if (markers.length > 0) return;
  clues.forEach((clue, idx) => {
    const isSolved = clueProgress[idx] && clueProgress[idx].solved;
    const icon = ui.createNumberedIcon(idx + 1, isSolved);
    const marker = L.marker(clue.coords, { icon }).addTo(map);
    markers.push(marker);

    // Build the popup content
    let popupContent = `<b>Spor ${idx + 1}</b><span class="hidden-clue-text">${clue.text}</span><br>`;
    popupContent += `<div class="hint-text">💡 ${clue.hint}</div><div id='options-${idx}'>`;
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
  updateMarkerStates(); // Set initial enabled/disabled states
}

function updateMarkerStates() {
  const currentClueIndex = Object.keys(clueProgress).filter(k => clueProgress[k].solved).length;

  markers.forEach((marker, idx) => {
    const isSolved = clueProgress[idx] && clueProgress[idx].solved;
    const isDisabled = idx > currentClueIndex;
    const newIcon = ui.createNumberedIcon(idx + 1, isSolved, isDisabled);
    marker.setIcon(newIcon);
  });

  map.closePopup();
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
  updateMarkerStates(); // This will mark the current as solved and enable the next one
  ui.updateScoreDisplay(calculateTotalScore());
  sessionStorage.setItem('clueProgress', JSON.stringify(clueProgress));

  // Check if all clues are solved
  const solvedCount = Object.keys(clueProgress).filter(k => clueProgress[k].solved).length;
  if (solvedCount === clues.length) {
    setTimeout(ui.showCompletionBanner, 500);
  }
}

/**
 * Centralized function to check a user's answer for a given clue.
 * @param {number} idx - The index of the clue.
 * @param {string} userAnswer - The user's submitted answer.
 */
function checkAnswer(idx, userAnswer) {
  const currentClueIndex = Object.keys(clueProgress).filter(k => clueProgress[k].solved).length;
  if (idx !== currentClueIndex) {
    // User is trying to answer a clue out of sequence
    alert("Du skal løse sporene i rækkefølge!");
    return;
  }

  const feedbackDiv = map.getPane('popupPane').querySelector(`#feedback-${idx}`);
  if (!feedbackDiv) return;

  const correctAnswer = clues[idx].answer;
  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

  if (isCorrect) {
    feedbackDiv.innerHTML = `Helt rigtigt! Godt gået! 🎉`;
    feedbackDiv.className = 'popup-feedback success';
    handleCorrectAnswer(idx);
  } else {
    // Handle incorrect answer
    if (!clueProgress[idx]) {
      clueProgress[idx] = { attempts: 0 };
    }
    clueProgress[idx].attempts += 1;
    sessionStorage.setItem('clueProgress', JSON.stringify(clueProgress));

    feedbackDiv.innerHTML = `Prøv igen! I kan godt! 💪`;
    feedbackDiv.className = 'popup-feedback error';
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

function disableTeamSelection(teamColor, teamName) {
  document.getElementById(`${teamColor}-team-name`).value = teamName;
  document.getElementById(`${teamColor}-team-name`).disabled = true;
  document.getElementById(`join-${teamColor}-btn`).disabled = true;
  document.getElementById(`join-${teamColor}-btn`).textContent = 'Holdet Spiller';
}

document.addEventListener('DOMContentLoaded', () => {
  // Version check to clear old session data
  const storedVersion = sessionStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    console.log('App version changed. Clearing old session data.');
    sessionStorage.removeItem('teamId');
    sessionStorage.removeItem('teamName');
    sessionStorage.removeItem('clueProgress');
    sessionStorage.setItem('appVersion', APP_VERSION);
    window.location.reload(); // Reload to start fresh
  }

  ui.hideCompletionBanner();

  // Check for existing teams to manage the start screen
  teamsRef.once('value', (snapshot) => {
    const teams = snapshot.val() || {};
    const teamCount = Object.keys(teams).length;
    let redTeamName = null;
    let blueTeamName = null;

    if (teams['red-team']) redTeamName = teams['red-team'].name;
    if (teams['blue-team']) blueTeamName = teams['blue-team'].name;

    if (redTeamName) disableTeamSelection('red', redTeamName);
    if (blueTeamName) disableTeamSelection('blue', blueTeamName);

    if (redTeamName && blueTeamName && teamId !== 'red-team' && teamId !== 'blue-team') {
      document.getElementById('game-full-msg').classList.remove('hidden');
    }
  });

  listenForTeamUpdates(); // This will continue to update the leaderboard
  // If team name already set, skip setup
  if (teamId && teamName) {
    startGame(false); // It's not a new game, just restoring state
    ui.setTeamNameInput(teamName); // Pre-fill the input for clarity
  }

  setupDevMode();
});

document.getElementById('toggle-leaderboard-btn').onclick = () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer.classList.toggle('leaderboard-collapsed');

  // After the transition, tell the map to recalculate its size
  setTimeout(() => {
    map.invalidateSize();
  }, 300); // 300ms matches the CSS transition duration
};

function joinTeam(teamColor) {
  const input = document.getElementById(`${teamColor}-team-name`);
  const name = input.value.trim();
  if (!name) {
    input.style.borderColor = 'red';
    input.focus();
    return;
  }
  
  teamId = `${teamColor}-team`;
  teamName = name;

  sessionStorage.setItem('teamId', teamId);
  sessionStorage.setItem('teamName', teamName);
  startGame(true); // This is a new game
}

document.getElementById('join-red-btn').onclick = () => joinTeam('red');
document.getElementById('join-blue-btn').onclick = () => joinTeam('blue');

document.getElementById('red-team-name').addEventListener('keyup', e => e.key === 'Enter' && joinTeam('red'));
document.getElementById('blue-team-name').addEventListener('keyup', e => e.key === 'Enter' && joinTeam('blue'));

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
  if (clueProgress[idx] && clueProgress[idx].solved) return; // Already solved
  checkAnswer(idx, selected);
};

window.submitTextAnswer = (idx) => {
  const input = map.getPane('popupPane').querySelector(`#input-${idx}`);
  if (!input || (clueProgress[idx] && clueProgress[idx].solved)) return; // No input or already solved

  const val = input.value.trim();
  if (val) {
    checkAnswer(idx, val);
  }
};