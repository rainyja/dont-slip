const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let gameSpeed, score, gameActive = false;
let player = { x: 180, y: 500, w: 60, h: 50 };
let obstacles = [];
let keys = {};
let waterOffset = 0;

function drawWater() {
  waterOffset += gameSpeed;
  if (waterOffset > 40) waterOffset = 0;
  
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2;
  for (let i = -40; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(45, i + waterOffset);
    ctx.bezierCurveTo(100, i + waterOffset - 10, 300, i + waterOffset + 10, 355, i + waterOffset);
    ctx.stroke();
  }
}

function drawPlayer(x, y) {
  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 45, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fleshy Arms (Connecting torso to floaties)
  ctx.fillStyle = "#ffdbac";
  ctx.fillRect(x - 5, y + 20, 15, 10); // Left arm stub
  ctx.fillRect(x + 50, y + 20, 15, 10); // Right arm stub

  // Torso (Back View)
  ctx.fillStyle = "#ffdbac"; 
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 10, 50, 35, [20, 20, 10, 10]);
  ctx.fill();
  
  // Back Crease
  ctx.strokeStyle = "#e0ac69";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + 15, y + 32); ctx.quadraticCurveTo(x + 30, y + 36, x + 45, y + 32); ctx.stroke();

  // Head
  ctx.fillStyle = "#4a3728"; 
  ctx.beginPath(); ctx.arc(x + 30, y + 8, 11, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#ffdbac"; ctx.fillRect(x + 20, y + 8, 20, 5);

  // Orange Floaties (on arms)
  ctx.fillStyle = "#ff9f43";
  ctx.beginPath(); ctx.roundRect(x - 12, y + 15, 18, 22, 5); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 54, y + 15, 18, 22, 5); ctx.fill();

  // Blue Swim Trunks
  ctx.fillStyle = "#0984e3";
  ctx.beginPath(); ctx.roundRect(x + 5, y + 38, 50, 12, [0, 0, 15, 15]); ctx.fill();
}

function drawObstacle(obs) {
  const { x, y, type } = obs;
  if (type === 'ice-cream') {
    // Triangular Cone
    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 15);
    ctx.lineTo(x + 30, y + 15);
    ctx.lineTo(x + 20, y + 40);
    ctx.closePath();
    ctx.fill();
    // Pink Scoop
    ctx.fillStyle = "#ff75a0";
    ctx.beginPath(); ctx.arc(x + 20, y + 12, 12, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'poo') {
    ctx.fillStyle = "#634832";
    ctx.fillRect(x + 5, y + 25, 30, 10); ctx.fillRect(x + 10, y + 15, 20, 10); ctx.fillRect(x + 15, y + 5, 10, 10);
  } else if (type === 'puddle') {
    ctx.fillStyle = "rgba(255, 234, 167, 0.7)";
    ctx.beginPath(); ctx.ellipse(x + 20, y + 20, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
  }
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function startGame(speed) {
  gameSpeed = speed; score = 0; gameActive = true; obstacles = []; player.x = 180;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('score').style.display = 'block';
  animate();
}

function spawnObstacle() {
  // Constraint 1: Max 7 obstacles on screen
  if (obstacles.length < 7 && Math.random() < 0.04) {
    const types = ['ice-cream', 'poo', 'puddle'];
    // Constraint 2: Lane-based spawning to prevent a solid horizontal line
    const laneWidth = (canvas.width - 130) / 3;
    const lane = Math.floor(Math.random() * 3);
    const newX = 55 + (lane * laneWidth) + (Math.random() * 20);

    // Check if another obstacle is too close vertically in the same area
    const isTooClose = obstacles.some(o => Math.abs(o.y - (-50)) < 100);

    if (!isTooClose) {
      obstacles.push({
        x: newX, y: -50,
        type: types[Math.floor(Math.random() * types.length)],
        w: 40, h: 40
      });
    }
  }
}

function animate() {
  if (!gameActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWater();

  // Slide Edges
  ctx.fillStyle = "#fd79a8";
  ctx.fillRect(0, 0, 40, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);

  if (keys['ArrowLeft'] && player.x > 45) player.x -= 7;
  if (keys['ArrowRight'] && player.x < canvas.width - 105) player.x += 7;

  drawPlayer(player.x, player.y);
  spawnObstacle();

  obstacles.forEach((obs, index) => {
    obs.y += gameSpeed;
    drawObstacle(obs);
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
  document.getElementById('score').style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
