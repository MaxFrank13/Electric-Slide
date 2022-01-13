const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hue = 100;

const keysPressed = {
  right: false,
  left: false
};
const gravity = 4.5;

class Player {
  constructor() {
    this.position = {
      x: 200,
      y: 0
    }
    this.velocity = {
      x: 10,
      y: 20
    }

    this.width = 50;
    this.height = 50;
    this.color = "green";
  }

  draw() {
    this.color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw();
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

const player = new Player();
window.addEventListener("keydown", function (e) {

  switch (e.key) {
    case "ArrowUp":
      if (player.position.y + player.height >= canvas.height) {
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

function checkDirection() {
  if (keysPressed.right && player.position.x + player.width < canvas.width - 200) {
    player.position.x += player.velocity.x;
  } else if (keysPressed.left && player.position.x > 100) {
    player.position.x -= player.velocity.x;
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  player.update();
  checkDirection();
  hue++;
  requestAnimationFrame(animate);
}
animate();
