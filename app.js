import { clues as staticClues } from './data.js';
import * as ui from './ui.js';
import { firebaseConfig } from './firebase-config.js';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const teamsRef = database.ref('teams');
firebase.analytics(); // Initialize Firebase Analytics

// --- App State ---
const APP_VERSION = '1.1'; // Increment this when clue data structure changes

// Team setup and score logic
let teamId = localStorage.getItem('teamId') || null;
let teamName = localStorage.getItem('teamName') || '';
// clueProgress will store attempts and score for each clue, e.g., { "0": { attempts: 1, score: 3, solved: true } }
let clueProgress = JSON.parse(localStorage.getItem('clueProgress') || '{}');
let markers = [];
let clues = staticClues; // Default to static clues

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

function startGame(isNewGame) {
  document.getElementById('leaderboard').classList.remove('hidden');
  ui.showMap(map, teamName, calculateTotalScore());
  // Center the map on the first clue to guide the players
  map.setView(clues[0].coords, 16);
  initializeMarkers();
  if (isNewGame) teamsRef.child(teamId).set({ name: teamName, score: 0 });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
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
  localStorage.setItem('clueProgress', JSON.stringify(clueProgress));

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
    localStorage.setItem('clueProgress', JSON.stringify(clueProgress));

    feedbackDiv.innerHTML = `Prøv igen! I kan godt! 💪`;
    feedbackDiv.className = 'popup-feedback error';
  }
}

// --- Event Listeners and Global Handlers ---

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
  // Version check to clear old session data
  const storedVersion = localStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    console.log('App version changed. Clearing old session data.');
    localStorage.removeItem('teamId');
    localStorage.removeItem('teamName');
    localStorage.removeItem('clueProgress');
    localStorage.setItem('appVersion', APP_VERSION);
    window.location.reload(); // Reload to start fresh
  }

  ui.hideCompletionBanner();
  listenForTeamUpdates(); // This will continue to update the leaderboard
  // If team name already set, skip setup
  if (teamId && teamName) {
    // A game is in progress, offer to continue
    const teamNameInput = document.getElementById('team-name');
    const startButton = document.getElementById('start-btn');
    teamNameInput.value = teamName;
    startButton.textContent = 'Fortsæt Spil!'; // Change button text to "Continue Game!"
  }
});

document.getElementById('toggle-leaderboard-btn').onclick = () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer.classList.toggle('leaderboard-collapsed');

  // After the transition, tell the map to recalculate its size
  setTimeout(() => {
    map.invalidateSize();
  }, 300); // 300ms matches the CSS transition duration
};

document.getElementById('start-btn').onclick = async () => {
  const input = document.getElementById('team-name');
  const name = input.value.trim();
  if (!name) {
    input.style.borderColor = 'red';
    input.focus();
    return;
  }

  // Check if the user is continuing with their saved game
  const savedClues = JSON.parse(localStorage.getItem('clues'));
  if (localStorage.getItem('teamName') === name && savedClues) {
    clues = savedClues; // Load saved random clues
    startGame(false);
    return;
  }

  // Show loading indicator
  const startButton = document.getElementById('start-btn');
  const loadingMsg = document.getElementById('loading-msg');
  startButton.disabled = true;
  loadingMsg.classList.remove('hidden');

  // NOTE: API fetching is disabled to use the custom Danish questions.
  // try {
  //   // Fetch new random questions and merge them with static locations
  //   const newClues = await fetchRandomClues();
  //   clues = newClues;
  //   localStorage.setItem('clues', JSON.stringify(clues)); // Save the new set of clues
  // } catch (error) {
  //   console.error("Could not fetch new clues, using fallback.", error);
  //   alert("Kunne ikke hente nye spørgsmål. Bruger standard spørgsmål.");
  //   clues = staticClues; // Fallback to static clues on error
  // } finally {
  //   // Hide loading indicator
  //   startButton.disabled = false;
  //   loadingMsg.classList.add('hidden');
  // }

  // Otherwise, start a new game
  const newTeamRef = teamsRef.push();
  teamId = newTeamRef.key;
  teamName = name;

  localStorage.setItem('teamId', teamId);
  localStorage.setItem('teamName', teamName);
  // Clear progress for the new game
  localStorage.removeItem('clueProgress');
  clueProgress = {};

  // Use the static clues and start the game immediately
  clues = staticClues;
  startButton.disabled = false;
  loadingMsg.classList.add('hidden');

  startGame(true); // This is a new game
};

document.getElementById('team-name').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('start-btn').click();
  }
});

document.getElementById('save-exit-btn').onclick = () => {
  if (confirm('Vil du gemme dit spil og afslutte? Du kan fortsætte, næste gang du åbner spillet.')) {
    // Hide game elements and show a clean start screen
    document.getElementById('team-header').classList.add('hidden');
    document.getElementById('map').classList.add('hidden');
    document.getElementById('leaderboard').classList.add('hidden');
    document.getElementById('team-setup').classList.remove('hidden');

    // Reset the input field for a clean look
    const teamNameInput = document.getElementById('team-name');
    teamNameInput.value = '';
    document.getElementById('start-btn').textContent = 'Start!';
  }
};

// Reset game logic
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Er I sikre på, I vil starte forfra? Alle jeres point og jeres holdnavn forsvinder.')) {
    if (teamId) {
      teamsRef.child(teamId).remove();
    }
    localStorage.removeItem('teamId');
    localStorage.removeItem('teamName');
    localStorage.removeItem('clueProgress');
    localStorage.removeItem('clues');
    // Also clear the input field and reset the button
    const teamNameInput = document.getElementById('team-name');
    teamNameInput.value = '';
    window.location.reload();
  }
};

async function fetchRandomClues() {
  const response = await fetch(`https://opentdb.com/api.php?amount=${staticClues.length}&type=multiple&encode=base64`);
  if (!response.ok) {
    throw new Error('Failed to fetch trivia questions');
  }
  const data = await response.json();

  return staticClues.map((staticClue, index) => {
    const triviaQuestion = data.results[index];
    if (!triviaQuestion) return staticClue; // Fallback for safety

    const questionText = atob(triviaQuestion.question);
    const correctAnswer = atob(triviaQuestion.correct_answer);
    const incorrectAnswers = triviaQuestion.incorrect_answers.map(a => atob(a));

    const options = [...incorrectAnswers, correctAnswer];
    // Shuffle options so the correct answer isn't always last
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      ...staticClue, // Keep coords and hint
      text: `🤔 ${questionText}`,
      options: options,
      answer: correctAnswer,
    };
  });
}

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