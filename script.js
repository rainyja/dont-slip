const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let gameSpeed, score, gameActive = false;
let player = { x: 180, y: 500, w: 40, h: 40 };
let obstacles = [];
let keys = {};

// Pixel Art Drawing Functions
function drawPlayer(x, y) {
  ctx.fillStyle = "#ffdbac"; // Skin tone
  ctx.fillRect(x + 10, y, 20, 20); 
  ctx.fillStyle = "#74b9ff"; // Pastel Blue Trunks
  ctx.fillRect(x + 5, y + 20, 30, 20);
}

function drawObstacle(obs) {
  if (obs.type === 'ice-cream') {
    ctx.fillStyle = "#ff75a0"; // Pink scoop
    ctx.fillRect(obs.x + 10, obs.y, 20, 20);
    ctx.fillStyle = "#ffeaa7"; // Cone
    ctx.fillRect(obs.x + 15, obs.y + 20, 10, 10);
  } else if (obs.type === 'poo') {
    ctx.fillStyle = "#634832";
    ctx.fillRect(obs.x + 10, obs.y + 10, 20, 15);
    ctx.fillRect(obs.x + 15, obs.y, 10, 10);
  } else if (obs.type === 'puddle') {
    ctx.fillStyle = "rgba(255, 234, 167, 0.6)"; // Transparent Yellow
    ctx.fillRect(obs.x, obs.y, 40, 30);
  }
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function startGame(speed) {
  gameSpeed = speed;
  score = 0;
  gameActive = true;
  obstacles = [];
  player.x = 180;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('score').style.display = 'block';
  animate();
}

function spawnObstacle() {
  const types = ['ice-cream', 'poo', 'puddle'];
  if (Math.random() < 0.03) {
    obstacles.push({
      x: Math.random() * (canvas.width - 40),
      y: -50,
      type: types[Math.floor(Math.random() * types.length)],
      w: 40, h: 40
    });
  }
}

function animate() {
  if (!gameActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Slide Edges (Pastel Pink)
  ctx.fillStyle = "#fd79a8";
  ctx.fillRect(0, 0, 40, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);

  // Player Movement
  if (keys['ArrowLeft'] && player.x > 45) player.x -= 6;
  if (keys['ArrowRight'] && player.x < canvas.width - 85) player.x += 6;

  drawPlayer(player.x, player.y);

  // Obstacle Logic
  spawnObstacle();
  obstacles.forEach((obs, index) => {
    obs.y += gameSpeed;
    drawObstacle(obs);

    // Collision Detection
    if (player.x < obs.x + obs.w && player.x + player.w > obs.x &&
        player.y < obs.y + obs.h && player.y + player.h > obs.y) {
      endGame();
    }

    if (obs.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
      document.getElementById('score').innerText = score + "m";
    }
  });

  requestAnimationFrame(animate);
}

function endGame() {
  gameActive = false;
  document.getElementById('game-over').style.display = 'flex';
}

function resetGame() {
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';
}
