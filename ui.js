export function showMap(map, teamName, totalScore) {
  document.getElementById('team-setup').classList.add('hidden');
  document.getElementById('map').classList.remove('hidden');
  document.getElementById('team-header').classList.remove('hidden');
  document.getElementById('team-name-display').textContent = teamName ? 'Hold: ' + teamName : '';
  document.getElementById('team-score').textContent = 'Point: ' + totalScore;

  // Invalidate map size to ensure it renders correctly after being un-hidden
  setTimeout(function() {
    map.invalidateSize();
  }, 0);
}

export function updateScoreDisplay(totalScore) {
  document.getElementById('team-score').textContent = 'Point: ' + totalScore;
}

export function createNumberedIcon(number, isSolved) {
  const markerHtml = `<div class="numbered-marker ${isSolved ? 'solved' : ''}">${number}</div>`;
  return L.divIcon({
    html: markerHtml,
    className: '', // Leaflet adds its own, we don't need an extra one
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

export function hideCompletionBanner() {
  const banner = document.getElementById('completion-banner');
  banner.style.display = 'none';
  banner.style.transform = 'translateY(-100%)';
}

export function showCompletionBanner() {
  const banner = document.getElementById('completion-banner');
  banner.style.display = 'block';
  banner.style.transform = 'translateY(0)';

  // Start the confetti!
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    shapes: ['square'],
    colors: ['#AF7448', '#787878', '#55FF55', '#505050']
  });
}

/**
 * Displays a flying text animation for points won.
 * @param {number} points The number of points to display.
 */
export function showFlyingPoints(points) {
  const pointsLabel = 'Point'; // Danish: "Point" is both singular and plural
  const pointsText = `+${points} ${pointsLabel}!`;

  const flyingTextElement = document.createElement('div');
  flyingTextElement.className = 'point-fly-up';
  flyingTextElement.textContent = pointsText;

  document.body.appendChild(flyingTextElement);

  // Remove the element after the animation completes (1.5s)
  setTimeout(() => flyingTextElement.remove(), 1500);
}

export function setTeamNameInput(name) {
    document.getElementById('team-name').value = name;
}