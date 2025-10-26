import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const teamsRef = database.ref('teams');

// Clear leaderboard logic
document.getElementById('clear-leaderboard-btn').onclick = () => {
  if (confirm('ADVARSEL: Dette vil slette ALLE hold og point fra databasen. Handlingen kan ikke fortrydes. Er du helt sikker?')) {
    // This removes the entire 'teams' node from Firebase
    teamsRef.remove()
      .then(() => {
        alert("Alle hold er blevet slettet. Spillet er nulstillet.");
        console.log("Leaderboard cleared successfully.");
      })
      .catch(error => {
        alert("Der opstod en fejl. Kunne ikke slette holdene.");
        console.error("Error clearing leaderboard: ", error);
      });
  }
};