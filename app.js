// **** Initialize canvas ****

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = "1420";
canvas.height = "800";

// **** Selectors ****

// elements
const main_El = document.querySelector("main");
const title_El = document.querySelector(".title");
const menu_El = document.querySelector(".menu-container");
const game_El = document.querySelector(".game");
const score_El = document.querySelector(".score");
const multiplier_El = document.querySelector(".multiplier")
// buttons
const startBtn = document.querySelector(".start");
const hsBtn = document.querySelector(".hs");
const controlsBtn = document.querySelector(".controls");
const sourceBtn = document.querySelector(".source");
const returnBtn = document.querySelector(".return");
const closeBtn = document.querySelector(".close");
// highscores
const highscores_div = document.querySelector(".highscore-overlay");
const scoresList = document.querySelector(".scores");
const modalOverlay = document.querySelector(".modal-overlay");
const initialsInput = document.getElementById("initials");
// controls
const controls_div = document.querySelector(".controls-overlay");

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
const gravity = 3.5;

// game counters
let mainScreen = true;
let gameEnd = false;
let scrollOffset = 0;
let points = 0;
let multiplierTime = 0;
let multiplier = 1;


// animations
let animateTitle;
let gameAnimation;
let degrees = 0;
let hue = 100;
let particlesArray = [];
let fireworksArray = [];

// highscores
let initials;
let highscoresArray = [];



// **** Game Objects ****

class Player {
  constructor() {
    this.position = {
      x: 300,
      y: 250
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
    this.grind = false;
  }

  draw() {
    this.color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw();

    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height - 75) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      player.grind = false;
      multiplier = 1;
      multiplierTime = 0;
      multiplier_El.textContent = "";
    }
  }
}

class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y
    }
    this.width = 950;
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

// **** Animation Objects ****

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

// main menu

window.addEventListener("DOMContentLoaded", function () {
  titleAnimation();
  getLocalStorage();
})

startBtn.addEventListener("click", function () {
  for (let i = 1; i < 125; i++) {
    platforms.push(new Platform({ x: Math.random() * canvas.width + (canvas.width / 2 * i), y: Math.random() * (canvas.height - 100) }));
  }
  game_El.classList.remove("hide");
  main_El.classList.add("hide");
  mainScreen = false;
  startGame(59.99);
});

hsBtn.addEventListener("click", function () {
  menu_El.classList.add("hide");
  highscores_div.classList.remove("hide");
});

returnBtn.addEventListener("click", function () {
  menu_El.classList.remove("hide");
  highscores_div.classList.add("hide");
  if (gameEnd) {
    window.location.reload(true);
    gameEnd = false;
  }
});

controlsBtn.addEventListener("click", function () {
  controls_div.classList.remove("hide");
});

closeBtn.addEventListener("click", function () {
  controls_div.classList.add("hide");
})


// arrow keys

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.key === "ArrowUp" || e.key === "w") {
    if (player.position.y + player.height <= canvas.height && player.velocity.y === 0 && e.altKey) {
      player.velocity.y -= 85;
    } else if (player.position.y + player.height <= canvas.height && player.velocity.y === 0) {
      player.velocity.y -= 60;
    }
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    keysPressed.left = true;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    keysPressed.right = true;
  }

  if (e.key === "Tab" && e.target.innerHTML === "code") {
    e.preventDefault();
    startBtn.focus();
  } else if (e.key === "Tab" && gameEnd) {
    cancelAnimationFrame(gameAnimation);
    modalOverlay.classList.remove('hide');
  }

  if (e.key === "Enter" && !modalOverlay.classList.contains("hide")) {
    e.preventDefault();
    initials = initialsInput.value;
    let record = {
      name: initials,
      number: points
    }
    sortScores(record);
    renderScores(highscoresArray);
    setLocalStorage();
    modalOverlay.classList.add("hide");
    game_El.classList.add("hide");
    main_El.classList.remove("hide");
    menu_El.classList.add("hide");
    highscores_div.classList.remove("hide");
    titleAnimation();
  }
})

window.addEventListener("keyup", function (e) {
  if (e.key === "ArrowLeft" || e.key === "a") {
    keysPressed.left = false;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    keysPressed.right = false;
  }
})

// mouse

canvas.addEventListener("mousemove", function (e) {
  if (gameEnd) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    console.log(e);
    for (let i = 0; i < 2; i++) {
      particlesArray.push(new Particle(mouse.x, mouse.y));
    }
  }
});

// **** Functions ****

// Movement and Scroll

function checkDirection() {
  if (!gameEnd) {
    if (keysPressed.right && player.position.x + player.width < canvas.width / 2 - 200) {
      player.position.x += player.velocity.x;
    } else if (keysPressed.left && player.position.x > 200) {
      player.position.x -= player.velocity.x;
    }
  }
}

function scrollBackground() {
  if (!gameEnd) {
    if (keysPressed.right && player.position.x + player.width > canvas.width / 2 - 200) {
      scrollOffset += player.velocity.x;
      platforms.forEach((platform) => {
        platform.position.x -= player.velocity.x;
      })
    } else if (keysPressed.left && player.position.x < 200) {
      scrollOffset -= player.velocity.x;
      points--;
      score_El.textContent = points;
      platforms.forEach((platform) => {
        platform.position.x += player.velocity.x;
      })
    }
  }
}

function speedControl() {
  if (
    (keysPressed.right && player.velocity.x <= 30) ||
    (keysPressed.left && player.velocity.x <= 30)
  ) {
    player.boost += 0.002;
    player.velocity.x += player.boost;
    checkDirection();
  } else if (keysPressed.right || keysPressed.left) {
    checkDirection();
  } else {
    player.boost = 0;
    player.velocity.x = 8;
  }
}

// Collision

function checkCollision() {
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
      player.grind = true;


      if (player.position.y < 150 && keysPressed.right) {
        points += 3;
        score_El.textContent = points;
        particlesArray.push(new Particle(player.position.x, player.position.y + player.height));

      } else if (keysPressed.right) {
        points += 2;
        score_El.textContent = points;
        particlesArray.push(new Particle(player.position.x, player.position.y + player.height));
      }
    }
  })
}

function pointsMultiplier() {
  if (player.grind && keysPressed.right) {

    multiplierTime++
    if (multiplierTime > 250) {
      multiplier = Math.floor(multiplierTime / 250) * 2;
      multiplier_El.textContent = `${multiplier}x`;
    }

  }
}

// Highscores

function sortScores(record) {
  for (let i = 0; i < highscoresArray.length; i++) {
    if (record.number > highscoresArray[i].number) {
      return highscoresArray.splice(i, 0, record);
    }
  }
  return highscoresArray.push(record);
}

function renderScores(object) {
  scoresList.innerHTML = "";
  for (let i = 0; i < object.length; i++) {
    let newScore = document.createElement("li");
    let entry = document.createTextNode(`${object[i].name} ${object[i].number}`);
    newScore.appendChild(entry);
    newScore.classList.add("entry");
    scoresList.appendChild(newScore);
  }
}

// Local Storage

function setLocalStorage() {
  localStorage.setItem("electricSlideHS", JSON.stringify(highscoresArray));
}

function getLocalStorage() {
  if (localStorage.getItem("electricSlideHS")) {
    highscoresArray = JSON.parse(localStorage.getItem("electricSlideHS"));
    renderScores(highscoresArray);
  }
}

// Animations


function drawFloor() {
  let gradient = ctx.createLinearGradient(0, canvas.height - 50, canvas.width, canvas.height)
  gradient.addColorStop(0, `hsl(191, 100%, 15%)`);
  gradient.addColorStop(0.5, `hsl(111, 100%, 86%)`);
  gradient.addColorStop(1, `hsl(191, 100%, 15%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height - 75, canvas.width, canvas.height);
}

function endingAnimation() {
  gameEnd = true;
  if (player.position.x < canvas.width) {
    player.position.x += 15;
    particlesArray.push(new Particle(player.position.x, player.position.y + player.height));
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

// **** Animation loop ****
let fps, fpsInterval, startTime, current, start, elapsed;

function startGame(fps) {
  fpsInterval = 1000 / fps;
  start = Date.now();
  startTime = start;
  animate();
}

function titleAnimation() {
  main_El.style.background = `linear-gradient(${degrees}deg,   black, var(--pink-50), var(--pink-70), transparent)`
  degrees++;
  animateTitle = requestAnimationFrame(titleAnimation);
}

function animate() {
  cancelAnimationFrame(animateTitle);
  gameAnimation = requestAnimationFrame(animate);
  current = Date.now();
  elapsed = current - start;
  if (elapsed > fpsInterval) {
    start = current - (elapsed % fpsInterval);
    ctx.fillStyle = "rgba(0,0,0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height - 75);
    player.update();
    player.draw();
    platforms.forEach((platform) => {
      platform.draw();
    });
    drawFloor();
    checkCollision();
    pointsMultiplier();
    handleParticles();
    speedControl();
    scrollBackground();
    hue++;
    if (scrollOffset >= 92000) {
      endingAnimation();
    }
  }
}
