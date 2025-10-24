const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 400,
  y: 300,
  size: 20,
  speed: 3,
  swords: 1,
};

const keys = {};
const bots = [];

for (let i = 0; i < 6; i++) {
  bots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 15,
    color: "red",
    angle: Math.random() * Math.PI * 2,
    speed: 1 + Math.random(),
  });
}

document.addEventListener("keydown", e => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", e => (keys[e.key.toLowerCase()] = false));

function movePlayer() {
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Boundaries
  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function moveBots() {
  for (const bot of bots) {
    bot.x += Math.cos(bot.angle) * bot.speed;
    bot.y += Math.sin(bot.angle) * bot.speed;

    // bounce from walls
    if (bot.x < 0 || bot.x > canvas.width) bot.angle = Math.PI - bot.angle;
    if (bot.y < 0 || bot.y > canvas.height) bot.angle = -bot.angle;
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "cyan";
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < player.swords; i++) {
    const angle = (Date.now() / 300 + (i * 2 * Math.PI) / player.swords);
    const radius = 40;
    const sx = player.x + Math.cos(angle) * radius;
    const sy = player.y + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.fill();

    // check collisions
    for (let j = bots.length - 1; j >= 0; j--) {
      const bot = bots[j];
      const dx = bot.x - sx;
      const dy = bot.y - sy;
      if (Math.hypot(dx, dy) < bot.size + 8) {
        bots.splice(j, 1);
        player.swords++;
        document.getElementById("score").textContent = "Swords: " + player.swords;

        // spawn replacement bot to keep arena busy
        bots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 15,
          color: "red",
          angle: Math.random() * Math.PI * 2,
          speed: 1 + Math.random(),
        });
      }
    }
  }
}

function drawBots() {
  for (const bot of bots) {
    ctx.beginPath();
    ctx.fillStyle = bot.color;
    ctx.arc(bot.x, bot.y, bot.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  moveBots();
  drawBots();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
