// Canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let paddleIndex = 0;

const width = 500;
const height = 700;

// Paddle
const paddle = {
  height: 10,
  width: 50,
  diff: 25, // Half paddle.
  x: [225, 225],
};
let trajectoryX = [0, 0];
let playerMoved = false;

// Ball
const ball = {
  x: 250,
  y: 350,
  radius: 5,
  direction: 1,
};

// Speed
const speed = {
  x: 0,
  y: 2,
  ai: 4,
};

// Score for Both Players (0 = User, 1 = AI)
const score = [0, 0];

// Create Canvas Element
function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  renderCanvas();
}

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // Paddle Color
  context.fillStyle = 'white';

  // Bottom Paddle
  context.fillRect(paddle.x[0], height - 20, paddle.width, paddle.height);

  // Top Paddle
  context.fillRect(paddle.x[1], 10, paddle.width, paddle.height);

  // Dashed Center Line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // Score
  context.font = '32px Courier New';
  context.fillText(score[0], 20, canvas.height / 2 + 50);
  context.fillText(score[1], 20, canvas.height / 2 - 30);
}

// Reset Ball to Center
function ballReset() {
  ball.x = width / 2;
  ball.y = height / 2;
  speed.y = 3;
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ball.y += speed.y * ball.direction;
  // Horizontal Speed
  if (playerMoved) {
    ball.x += speed.x;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if (ball.x < 0 && speed.x < 0) {
    speed.x = -speed.x;
  }
  // Bounce off Right Wall
  if (ball.x > width && speed.x > 0) {
    speed.x = -speed.x;
  }
  // Bounce off player paddle (bottom)
  if (ball.y > height - paddle.diff) {
    if (ball.x >= paddle.x[0] && ball.x <= paddle.x[0] + paddle.width) {
      // Add Speed on Hit
      if (playerMoved) {
        speed.y += 1;
        // Max Speed
        if (speed.y > 5) {
          speed.y = 5;
        }
      }
      ball.direction = -ball.direction;
      trajectoryX[0] = ball.x - (paddle.x[0] + paddle.diff);
      speed.x = trajectoryX[0] * 0.3;
    } else {
      // Reset Ball, add to Computer Score
      ballReset();
      score[1]++;
    }
  }
  // Bounce off computer paddle (top)
  if (ball.y < paddle.diff) {
    if (ball.x >= paddle.x[1] && ball.x <= paddle.x[1] + paddle.width) {
      // Add Speed on Hit
      if (playerMoved) {
        speed.y += 1;
        // Max Speed
        if (speed.y > 5) {
          speed.y = 5;
        }
      }
      ball.direction = -ball.direction;
      trajectoryX[1] = ball.x - (paddle.x[1] + paddle.diff);
      speed.x = trajectoryX[1] * 0.3;
    } else {
      // Reset Ball, Increase Computer Difficulty, add to Player Score
      if (speed.ai < 6) {
        speed.ai += 0.5;
      }
      ballReset();
      score[0]++;
    }
  }
}

// Computer Movement
function computerAI() {
  if (playerMoved) {
    if (paddle.x[1] + paddle.diff < ball.x) {
      paddle.x[1] += speed.ai;
    } else {
      paddle.x[1] -= speed.ai;
    }
    if (paddle.x[1] < 0) {
      paddle.x[1] = 0;
    } else if (paddle.x[1] > width - paddle.width) {
      paddle.x[1] = width - paddle.width;
    }
  }
}

// Called Every Frame
function animate() {
  computerAI();
  ballMove();
  renderCanvas();
  ballBoundaries();
  window.requestAnimationFrame(animate);
}

// Start Game, Reset Everything
function startGame() {
  createCanvas();

  paddleIndex = 0;
  window.requestAnimationFrame(animate);
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    paddle.x[paddleIndex] = e.offsetX;
    if (paddle.x[paddleIndex] < 0) {
      paddle.x[paddleIndex] = 0;
    }
    if (paddle.x[paddleIndex] > width - paddle.width) {
      paddle.x[paddleIndex] = width - paddle.width;
    }
    // Hide Cursor
    canvas.style.cursor = 'none';
  });
}

// On Load
startGame();
