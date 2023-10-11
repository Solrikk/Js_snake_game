const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const gridSize = 20;
const snakeColor = "#000";
const appleColor = "#000";

let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
let apple = { x: 10, y: 10 };
let direction = "right";
let gameOver = false;
let growSnake = false;

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  const directions = { 37: "left", 38: "up", 39: "right", 40: "down" };
  if (directions[event.keyCode] && direction !== directions[event.keyCode]) {
    direction = directions[event.keyCode];
  }
}

function drawRect(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
  snake.forEach(segment => drawRect(segment.x, segment.y, snakeColor));
}

function drawApple() {
  drawRect(apple.x, apple.y, appleColor);
}

function update() {
  if (gameOver) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  moveSnake();
  drawSnake();
  drawApple();

  if (isSnakeCollidingWithApple()) {
    moveApple();
    growSnake = true;
  }

  if (isSnakeCollidingWithSelf() || isSnakeCollidingWithWall()) {
    gameOver = true;
    const restartButton = document.getElementById("restartButton");
    restartButton.style.display = "block";
    restartButton.addEventListener("click", restartGame);
  }

  setTimeout(update, 100);
}

function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (!growSnake) {
    snake.pop();
  } else {
    growSnake = false;
  }
}

function moveApple() {
  apple.x = Math.floor(Math.random() * (canvas.width / gridSize));
  apple.y = Math.floor(Math.random() * (canvas.height / gridSize));
}

function isSnakeCollidingWithApple() {
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    return true;
  }
  return false;
}

function isSnakeCollidingWithSelf() {
  const [head, ...body] = snake;
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function isSnakeCollidingWithWall() {
  const head = snake[0];
  return head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize;
}

function restartGame() {
  snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  apple = { x: 10, y: 10 };
  direction = "right";
  gameOver = false;
  growSnake = false;

  const restartButton = document.getElementById("restartButton");
  restartButton.style.display = "none";
  restartButton.removeEventListener("click", restartGame);

  update();
}

update();