// Update the player dimensions to be wider to account for the floaties
let player = { x: 180, y: 500, w: 60, h: 50 }; 

function drawPlayer(x, y) {
  // 1. SHADOW (Under the character for "grounded" look)
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 45, 25, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. THE BACK (Main Torso)
  // Using a wide, rounded shape for a heavy-set realistic back profile
  ctx.fillStyle = "#ffdbac"; 
  ctx.beginPath();
  // Drawing the main back "roll" and shoulders
  ctx.roundRect(x + 5, y + 10, 50, 35, [20, 20, 10, 10]);
  ctx.fill();
  
  // Subtle skin fold/shading on the back for realism
  ctx.strokeStyle = "#e0ac69";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 30);
  ctx.quadraticCurveTo(x + 30, y + 35, x + 45, y + 30);
  ctx.stroke();

  // 3. THE HEAD (Back view - no face)
  ctx.fillStyle = "#ffdbac";
  ctx.beginPath();
  ctx.arc(x + 30, y + 8, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair (covering the back of the head)
  ctx.fillStyle = "#4a3728";
  ctx.beginPath();
  ctx.arc(x + 30, y + 6, 11, Math.PI, 0); // Top half of hair
  ctx.fill();
  ctx.fillRect(x + 19, y + 6, 22, 6); // Bottom "cut" of the hair

  // 4. THE ARMS & FLOATIES
  // Left Arm + Floaty
  ctx.fillStyle = "#ffdbac";
  ctx.fillRect(x - 5, y + 15, 12, 20); // Arm flesh
  
  ctx.fillStyle = "#ff9f43"; // Bright Orange Floaty
  ctx.beginPath();
  ctx.roundRect(x - 8, y + 18, 15, 18, 5);
  ctx.fill();
  // Floaty Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(x - 5, y + 20, 4, 8);

  // Right Arm + Floaty
  ctx.fillStyle = "#ffdbac";
  ctx.fillRect(x + 53, y + 15, 12, 20); // Arm flesh
  
  ctx.fillStyle = "#ff9f43";
  ctx.beginPath();
  ctx.roundRect(x + 53, y + 18, 15, 18, 5);
  ctx.fill();
  // Floaty Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(x + 56, y + 20, 4, 8);

  // 5. SWIM TRUNKS (Seated view)
  ctx.fillStyle = "#0984e3"; // Blue Trunks
  ctx.beginPath();
  // The trunks wrap around the bottom of the torso
  ctx.roundRect(x + 5, y + 38, 50, 12, [0, 0, 15, 15]);
  ctx.fill();
  
  // Waistband detail
  ctx.fillStyle = "#74b9ff";
  ctx.fillRect(x + 5, y + 38, 50, 3);
}
