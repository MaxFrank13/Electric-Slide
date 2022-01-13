// **** Initialize canvas ****

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = "600";

// selectors
const score = document.querySelector("h1");
const startBtn = document.querySelector(".start-btn");
// **** Global Variables ****

// keys & mouse
const keysPressed = {
  right: false,
  left: false
};
const mouse = {
  x: undefined,
  y: undefined,
}
// physics
const gravity = 4.5;

// game counters
let gameEnd = false;
let scrollOffset = 0;
let points = 0;


// animations 
let hue = 100;
let particlesArray = [];


// **** Game Objects ****

class Player {
  constructor() {
    this.position = {
      x: 300,
      y: canvas.height - 100
    }
    this.velocity = {
      x: 8,
      y: 0
    }

    this.width = 50;
    this.height = 50;
    this.color = "green";
    this.momentum = false;
    this.boost = 0;
  }

  draw() {
    this.color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw();
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y < canvas.height - 100) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      this.position.y = canvas.height - 100;
    }
  }
}

class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y
    }
    this.width = 650;
    this.height = 30;
  }
  draw() {
    let gradient = ctx.createLinearGradient(this.position.x, this.position.y, this.position.x + this.width, this.position.y + this.height)
    gradient.addColorStop(0, `hsl(191, 100%, 63%)`);
    gradient.addColorStop(0.5, `hsl(${hue}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(191, 100%, 63%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const player = new Player();
const platforms = [];
for (let i = 0; i < 20; i++) {
  platforms.push(new Platform({ x: 1050 + (4500 * i), y: 420 - Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 1200 + (4500 * i), y: 150 + Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 2050 + (4500 * i), y: 200 - Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 2850 + (4500 * i), y: 250 + Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 3250 + (4500 * i), y: 350 - Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 3850 + (4500 * i), y: 420 + Math.random() * 10 * i }));
  platforms.push(new Platform({ x: 4350 + (4500 * i), y: 270 - Math.random() * 10 * i }));
}

// **** Animation Objects ****

class Particle {
  constructor() {
    this.x = player.position.x;
    this.y = player.position.y + player.height;
    this.size = Math.random() * 8 + 1;
    this.speedX = Math.random() * 1 - 3.5;
    this.speedY = Math.random() * 1.5 - 2;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.05;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// **** Event listeners ****

// resizing

window.addEventListener("resize", function(){
  canvas.width = window.innerWidth;
})

// game start
startBtn.addEventListener("click", function() {
  animate();
});

// arrow keys
window.addEventListener("keydown", function (e) {

  switch (e.key) {
    case "ArrowUp":
      if (player.position.y + player.height <= canvas.height && player.velocity.y === 0 && e.ctrlKey) {
        player.velocity.y -= 80;
      } else
        if (player.position.y + player.height <= canvas.height && player.velocity.y === 0) {
          player.velocity.y -= 50;
        }
      break;
    case "ArrowLeft":
      keysPressed.left = true;
      break;
    case "ArrowRight":
      keysPressed.right = true;
      break;
  }
})
window.addEventListener("keyup", function (e) {

  switch (e.key) {
    case "ArrowLeft":
      keysPressed.left = false;
      break;
    case "ArrowRight":
      keysPressed.right = false;
      break;
  }
})

// mouse
canvas.addEventListener("click", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i < 3; i++) {
    particlesArray.push(new Particle());
  }
});

// **** Functions ****

// Movement and Scroll

function checkDirection() {
  if (keysPressed.right && player.position.x + player.width < canvas.width / 2 - 200) {
    player.position.x += player.velocity.x;
  } else if (keysPressed.left && player.position.x > 200) {
    player.position.x -= player.velocity.x;
  }
}

function scrollBackground() {
  console.log(scrollOffset);
  if (keysPressed.right && player.momentum && player.position.x + player.width > canvas.width / 2 - 200) {
    scrollOffset += player.velocity.x;
    platforms.forEach((platform) => {
      platform.position.x -= player.velocity.x;
    })
  } else if (keysPressed.right && player.position.x + player.width > canvas.width / 2 - 200) {
    scrollOffset += player.velocity.x;
    platforms.forEach((platform) => {
      platform.position.x -= player.velocity.x;
    })
  } else if (keysPressed.left && player.position.x < 200) {
    scrollOffset -= player.velocity.x;
    points--;
    score.textContent = points;
    platforms.forEach((platform) => {
      platform.position.x += player.velocity.x;
    })
  }
}

function speedBoost() {
  if (
    (keysPressed.right && player.velocity.x <= 20) ||
    (keysPressed.left && player.velocity.x <= 20)
  ) {
    player.boost += 0.002;
    player.velocity.x += player.boost;
    console.log("boosting");
    player.momentum = true;
    checkDirection();
  } else if (keysPressed.right || keysPressed.left) {
    checkDirection();
  } else {
    player.boost = 0;
    player.velocity.x = 8;
    player.momentum = false;
  }
}

// Collision

function checkCollision() {
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x < platform.position.x + platform.width &&
      (keysPressed.right || keysPressed.left)
    ) {
      player.velocity.y = 0;
      if (player.position.y < 150 && keysPressed.right) {
        points += 3;
        score.textContent = points;

        particlesArray.push(new Particle());

      } else if (keysPressed.right) {
        points += 2;
        score.textContent = points;

        particlesArray.push(new Particle());
      }
    } else if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x < platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
    }
  })
}

// Animations

function drawFloor() {
  let gradient = ctx.createLinearGradient(0, canvas.height - 100 + player.height, canvas.width, canvas.height)
  gradient.addColorStop(0, `hsl(191, 100%, 15%)`);
  gradient.addColorStop(0.5, `hsl(111, 100%, 86%)`);
  gradient.addColorStop(1, `hsl(191, 100%, 15%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height - 100 + player.height, canvas.width, canvas.height);
}

function endFlag() {
  if (scrollOffset >= 92000) {
    gameEnd = true;
    ctx.fillStyle = "red";
    ctx.fillRect(600, canvas.height - 100, 50, 100);
  }
}
function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = particlesArray[i].size / 8;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
        ctx.stroke();
      }

    }
    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}


// Animation loop

function animate() {
  ctx.fillStyle = "rgba(0,0,0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  platforms.forEach((platform) => {
    platform.draw();
  });
  drawFloor();
  handleParticles();
  scrollBackground();
  speedBoost();
  checkCollision();
  endFlag();
  hue++;
  requestAnimationFrame(animate);
}
