const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let gameSpeed, score, gameActive = false;
let player = { x: 180, y: 500, w: 40, h: 40 };
let obstacles = [];
let keys = {};

// --- NEW ENHANCED DRAWING FUNCTIONS ---

function drawPlayer(x, y) {
  // Head/Skin
  ctx.fillStyle = "#ffdbac"; 
  ctx.fillRect(x + 10, y, 20, 20); 
  // Hair/Details (Adding a small "cap" or hair line)
  ctx.fillStyle = "#634832";
  ctx.fillRect(x + 10, y, 20, 5);
  // Eyes
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(x + 14, y + 8, 3, 3);
  ctx.fillRect(x + 23, y + 8, 3, 3);
  // Trunks with Shading
  ctx.fillStyle = "#74b9ff"; // Base Blue
  ctx.fillRect(x + 5, y + 20, 30, 20);
  ctx.fillStyle = "#0984e3"; // Shadow Blue
  ctx.fillRect(x + 5, y + 35, 30, 5); 
}

function drawObstacle(obs) {
  const { x, y } = obs;

  if (obs.type === 'ice-cream') {
    // 1. Cone (Triangle-ish)
    ctx.fillStyle = "#e67e22"; // Darker cone edge
    ctx.fillRect(x + 12, y + 18, 16, 20);
    ctx.fillStyle = "#ffeaa7"; // Lighter cone center
    ctx.fillRect(x + 15, y + 18, 10, 18);
    
    // 2. Scoop (The "Realism" comes from the highlight)
    ctx.fillStyle = "#ff75a0"; // Base Pink
    ctx.beginPath();
    ctx.arc(x + 20, y + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#ffaddb"; // Shine/Highlight
    ctx.fillRect(x + 15, y + 6, 6, 4);

  } else if (obs.type === 'poo') {
    // Layered "Swirl" Look
    ctx.fillStyle = "#634832"; // Base Brown
    ctx.fillRect(x + 5, y + 25, 30, 10);  // Bottom tier
    ctx.fillRect(x + 10, y + 15, 20, 10); // Middle tier
    ctx.fillRect(x + 15, y + 5, 10, 10);  // Top tier
    
    // Highlight for volume
    ctx.fillStyle = "#8d6e63"; 
    ctx.fillRect(x + 8, y + 26, 10, 3);
    ctx.fillRect(x + 12, y + 16, 6, 3);
    
  } else if (obs.type === 'puddle') {
    // "Realistic" Liquid Puddle
    ctx.fillStyle = "rgba(255, 234, 167, 0.7)"; // Yellow Liquid
    ctx.beginPath();
    // Making it an oval instead of a square
    ctx.ellipse(x + 20, y + 20, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add white "glint" to show it's wet
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x + 15, y + 12, 8, 3);
  }
}

// --- REST OF GAME ENGINE ---

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function startGame(speed) {
  gameSpeed = speed;
  score = 0;
  gameActive = true;
  obstacles = [];
  player.x = 180;
  document.getElementById('start-screen').style.display = 'none';
  if(document.getElementById('game-over')) document.getElementById('game-over').style.display = 'none';
  document.getElementById('score').style.display = 'block';
  animate();
}

function spawnObstacle() {
  const types = ['ice-cream', 'poo', 'puddle'];
  // Adjusted rate for better gameplay
  if (Math.random() < 0.04) {
    obstacles.push({
      x: 45 + Math.random() * (canvas.width - 130), // Keeps obstacles inside the pink edges
      y: -50,
      type: types[Math.floor(Math.random() * types.length)],
      w: 40, h: 40
    });
  }
}

function animate() {
  if (!gameActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Slide Edges (Pastel Pink) with a small inner shadow
  ctx.fillStyle = "#fd79a8";
  ctx.fillRect(0, 0, 40, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);
  ctx.fillStyle = "#e84393"; // Darker pink edge line
  ctx.fillRect(35, 0, 5, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 5, canvas.height);

  // Player Movement
  if (keys['ArrowLeft'] && player.x > 45) player.x -= 7;
  if (keys['ArrowRight'] && player.x < canvas.width - 85) player.x += 7;

  drawPlayer(player.x, player.y);

  // Obstacle Logic
  spawnObstacle();
  obstacles.forEach((obs, index) => {
    obs.y += gameSpeed;
    drawObstacle(obs);

    // Collision Detection (Box-based)
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
  const gameOverScreen = document.getElementById('game-over');
  if(gameOverScreen) gameOverScreen.style.display = 'flex';
}

function resetGame() {
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';
}
