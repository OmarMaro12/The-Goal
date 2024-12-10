const ball = document.getElementById("ball");
const goal = document.getElementById("goal");
const obstacles = document.querySelectorAll(".obstacle");
const levelDisplay = document.getElementById("level-display");
const statusMessage = document.getElementById("status-message");
const restartBtn = document.getElementById("restart-btn");
const controls = {
  left: document.getElementById("left-btn"),
  right: document.getElementById("right-btn"),
  up: document.getElementById("up-btn"),
  down: document.getElementById("down-btn"),
};

let ballPosition = { x: 180, y: 180 };
let level = 1;
let obstacleSpeeds = [2, 3, 4];
let obstacleDirections = [1, -1, 1];
let gameRunning = true;

// Move Ball Function
function moveBall(direction) {
  if (!gameRunning) return;

  const step = 10;
  if (direction === "left") ballPosition.x = Math.max(0, ballPosition.x - step);
  if (direction === "right")
    ballPosition.x = Math.min(380, ballPosition.x + step);
  if (direction === "up") ballPosition.y = Math.max(0, ballPosition.y - step);
  if (direction === "down")
    ballPosition.y = Math.min(380, ballPosition.y + step);

  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  checkCollision();
  checkWin();
}

// Check Collision with Obstacles
function checkCollision() {
  const ballRect = ball.getBoundingClientRect();

  obstacles.forEach((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      ballRect.x < obstacleRect.x + obstacleRect.width &&
      ballRect.x + ballRect.width > obstacleRect.x &&
      ballRect.y < obstacleRect.y + obstacleRect.height &&
      ballRect.y + ballRect.height > obstacleRect.y
    ) {
      endGame("lose");
    }
  });
}

// Check for Win
function checkWin() {
  const ballRect = ball.getBoundingClientRect();
  const goalRect = goal.getBoundingClientRect();

  if (
    ballRect.x < goalRect.x + goalRect.width &&
    ballRect.x + ballRect.width > goalRect.x &&
    ballRect.y < goalRect.y + goalRect.height &&
    ballRect.y + ballRect.height > goalRect.y
  ) {
    endGame("win");
  }
}

// End Game
function endGame(result) {
  gameRunning = false;
  if (result === "win") {
    level++;
    levelDisplay.textContent = `Level: ${level}`;
    resetGame();
  } else {
    statusMessage.textContent = "Game Over! You lose!";
    restartBtn.style.display = "block";
  }
}

// Reset Game for Next Level
function resetGame() {
  gameRunning = true;
  ballPosition = { x: 180, y: 180 };
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  goal.style.top = `${Math.random() * 350}px`;
  goal.style.left = `${Math.random() * 350}px`;

  obstacles.forEach((obstacle, index) => {
    obstacle.style.top = `${Math.random() * 350}px`;
    obstacle.style.left = `${Math.random() * 300}px`;
    obstacleSpeeds[index] += 1; // Increase speed with each level
  });
}

// Move Obstacles
function moveObstacles() {
  if (!gameRunning) return;

  obstacles.forEach((obstacle, index) => {
    let currentLeft = parseInt(obstacle.style.left) || 0;
    currentLeft += obstacleSpeeds[index] * obstacleDirections[index];

    if (currentLeft <= 0 || currentLeft >= 300) {
      obstacleDirections[index] *= -1; // Reverse direction
    }

    obstacle.style.left = `${currentLeft}px`;
  });

  checkCollision();
  requestAnimationFrame(moveObstacles);
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveBall("left");
  if (e.key === "ArrowRight") moveBall("right");
  if (e.key === "ArrowUp") moveBall("up");
  if (e.key === "ArrowDown") moveBall("down");
});

Object.keys(controls).forEach((dir) => {
  controls[dir].addEventListener("click", () => moveBall(dir));
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  statusMessage.textContent = "";
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  resetGame();
});

// Start Game
resetGame();
moveObstacles();

// End Game
function endGame(result) {
  gameRunning = false;
  if (result === "win") {
    level++;
    levelDisplay.textContent = `Level: ${level}`;
    resetGame();
  } else {
    statusMessage.textContent = "Game Over! You lose!";
    restartBtn.style.display = "block";
    cancelAnimationFrame(animationId); // Stop obstacle animation
  }
}

// Reset Game for Next Level or Restart
function resetGame() {
  gameRunning = true;
  ballPosition = { x: 180, y: 180 };
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  goal.style.top = `${Math.random() * 350}px`;
  goal.style.left = `${Math.random() * 350}px`;

  obstacles.forEach((obstacle, index) => {
    obstacle.style.top = `${Math.random() * 350}px`;
    obstacle.style.left = `${Math.random() * 300}px`;
    obstacleSpeeds[index] = 2 + index; // Reset speeds
    obstacleDirections[index] = index % 2 === 0 ? 1 : -1; // Reset directions
  });

  moveObstacles(); // Restart obstacle movement
}

// Restart Button Handler
restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  statusMessage.textContent = "";
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  resetGame();
});

// Reset Game for Next Level or Restart
function resetGame() {
  gameRunning = true;
  ballPosition = { x: 180, y: 180 };
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  // Reset goal position
  goal.style.top = `${Math.random() * 350}px`;
  goal.style.left = `${Math.random() * 350}px`;

  // Reset obstacles
  obstacles.forEach((obstacle, index) => {
    let validPosition = false;

    while (!validPosition) {
      const randomTop = Math.random() * 350;
      const randomLeft = Math.random() * 300;

      // Check for overlap with ball
      const ballRect = {
        top: ballPosition.y,
        left: ballPosition.x,
        bottom: ballPosition.y + 20,
        right: ballPosition.x + 20,
      };

      const obstacleRect = {
        top: randomTop,
        left: randomLeft,
        bottom: randomTop + 10,
        right: randomLeft + 100,
      };

      // If no overlap, position is valid
      if (
        ballRect.right < obstacleRect.left ||
        ballRect.left > obstacleRect.right ||
        ballRect.bottom < obstacleRect.top ||
        ballRect.top > obstacleRect.bottom
      ) {
        obstacle.style.top = `${randomTop}px`;
        obstacle.style.left = `${randomLeft}px`;
        validPosition = true;
      }
    }

    // Reset speeds and directions
    obstacleSpeeds[index] = 2 + index; // Reset speeds
    obstacleDirections[index] = index % 2 === 0 ? 1 : -1; // Reset directions
  });

  moveObstacles(); // Restart obstacle movement
}
