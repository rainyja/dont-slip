const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let gameSpeed, score, gameActive = false;
let player = { x: 180, y: 500, w: 60, h: 50 }; // Wider for the floaties
let obstacles = [];
let keys = {};

function drawPlayer(x, y) {
  // 1. Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 45, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Wide Back (Skin)
  ctx.fillStyle = "#ffdbac"; 
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 10, 50, 35, [20, 20, 10, 10]);
  ctx.fill();
  
  // Back Crease
  ctx.strokeStyle = "#e0ac69";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 32);
  ctx.quadraticCurveTo(x + 30, y + 36, x + 45, y + 32);
  ctx.stroke();

  // 3. Head/Hair (Back view)
  ctx.fillStyle = "#4a3728"; 
  ctx.beginPath();
  ctx.arc(x + 30, y + 8, 11, Math.PI, 0); 
  ctx.fill();
  ctx.fillStyle = "#ffdbac";
  ctx.fillRect(x + 20, y + 8, 20, 5);

  // 4. Arms & Orange Floaties
  ctx.fillStyle = "#ff9f43";
  // Left Floaty
  ctx.beginPath();
  ctx.roundRect(x - 8, y + 18, 15, 20, 5);
  ctx.fill();
  // Right Floaty
  ctx.beginPath();
  ctx.roundRect(x + 53, y + 18, 15, 20, 5);
  ctx.fill();

  // 5. Blue Swim Trunks
  ctx.fillStyle = "#0984e3";
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 38, 50, 12, [0, 0, 15, 15]);
  ctx.fill();
}

function drawObstacle(obs) {
  const { x, y, type } = obs;
  if (type === 'ice-cream') {
    ctx.fillStyle = "#e67e22"; ctx.fillRect(x + 12, y + 18, 16, 20);
    ctx.fillStyle = "#ff75a0"; ctx.beginPath(); ctx.arc(x + 20, y + 12, 12, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'poo') {
    ctx.fillStyle = "#634832"; ctx.fillRect(x + 5, y + 25, 30, 10); ctx.fillRect(x + 10, y + 15, 20, 10); ctx.fillRect(x + 15, y + 5, 10, 10);
  } else if (type === 'puddle') {
    ctx.fillStyle = "rgba(255, 234, 167, 0.7)"; ctx.beginPath(); ctx.ellipse(x + 20, y + 20, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
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
  if (Math.random() < 0.04) {
    const types = ['ice-cream', 'poo', 'puddle'];
    obstacles.push({
      x: 45 + Math.random() * (canvas.width - 130),
      y: -50,
      type: types[Math.floor(Math.random() * types.length)],
      w: 40, h: 40
    });
  }
}

function animate() {
  if (!gameActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
